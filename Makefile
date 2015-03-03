# HOWTO:
# - Save the map you want to convert as 'input/map.osm' first!
# - Install all dependencies with npm in this folder:
# 	npm install osmtogeojson mathjs uglify-js
#

node   = "/bin/node"
osm2gj = "./node_modules/osmtogeojson/osmtogeojson"
uglify = "./node_modules/uglify-js/bin/uglifyjs"
uflags = "--mangle --compress"


#
# PHONY TARGETS
#
.PHONY: all clean

all: out/ucty.bin out/ucty.js out/index_example.html
	du -c -h out/ucty*

clean:
	rm -r temp out || true

#
# OUTPUT FOLDER
#

out/index_example.html: src/client/index_example.html
	cp src/client/index_example.html out/index_example.html

out/ucty.bin: temp/ucty_client_and_map.ugly
	mkdir -p out
	lzma -k --stdout temp/ucty_client_and_map.ugly \
		> out/ucty.bin

out/ucty.js: temp/unlzma.js
	mkdir -p out
	$(uglify) $(uflags) --output out/ucty.js temp/unlzma.js


#
# TEMP FOLDER
#

temp/unlzma.js: src/client/decompress.js src/lzma-js/lzma-d-min.js
	mkdir -p temp
	cat src/lzma-js/lzma-d-min.js src/client/decompress.js > temp/unlzma.js
	sed -i 's/"use strict";//g' temp/unlzma.js

# TODO: add enclose option
temp/ucty_client_and_map.ugly: temp/ucty_client_and_map.js
	$(uglify) $(uflags) \
		--output temp/ucty_client_and_map.ugly \
		temp/ucty_client_and_map.js

temp/ucty_client_and_map.js: temp/ucty_map.js src/client/js/*
	cat temp/ucty_map.js src/client/js/* > temp/ucty_client_and_map.js
	sed -i 's/"use strict";//g' temp/ucty_client_and_map.js

temp/ucty_map.js: temp/map.geojson src/convert/geojson_to_ucty.js
	$(node) src/convert/geojson_to_ucty.js \
		temp/map.geojson temp/ucty_map.js

temp/map.geojson : input/map.osm
	mkdir -p temp
	$(osm2gj) input/map.osm > temp/map.geojson

#
# INPUT FOLDER
#

input/map.osm:
	$(info ERROR: Export the map you want to shrink from openstreetmap.org and save it as input/map.osm!)
	exit 1
