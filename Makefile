#
# CONFIGURATION
#
node   = /bin/node
osm2gj = ./node_modules/osmtogeojson/osmtogeojson
uglify = ./node_modules/uglify-js/bin/uglifyjs
uflags = --compress unsafe --screw-ie8


src_x0 = 11.3638
src_x1 = 11.4617
src_y0 = 48.7313
src_y1 = 48.7906


# Coordinates of the area that will be cut out.
cut_x0 = $(src_x0)
cut_x1 = $(src_x1)
cut_y0 = $(src_y0)
cut_y1 = $(src_y1)


#
# PHONY TARGETS
#
.PHONY: all clean ugly

all: out/ucty.bin out/ucty.js out/index_example.html
	src/stats.sh

clean:
	rm -r temp out || true

ugly:
	rm out/ucty.js temp/*.ugly || true
	make


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
	$(uglify) $(uflags) --output out/ucty.js \
	--mangle sort,eval temp/unlzma.js


#
# TEMP FOLDER
#

temp/unlzma.js: src/client/decompress.js src/lzma-js/lzma-d-min.js
	mkdir -p temp
	cat src/lzma-js/lzma-d-min.js src/client/decompress.js > temp/unlzma.js
	sed -i 's/"use strict";//g' temp/unlzma.js

temp/ucty_client_and_map.ugly: temp/ucty_client_and_map.js
	$(uglify) $(uflags) --enclose \
		--output temp/ucty_client_and_map.ugly \
		--mangle sort,toplevel,eval \
		temp/ucty_client_and_map.js

temp/ucty_client_and_map.js: temp/ucty_map.js src/client/js/*
	cat temp/ucty_map.js src/client/js/* > temp/ucty_client_and_map.js
	sed -i 's/"use strict";//g' temp/ucty_client_and_map.js

temp/ucty_map.js: temp/map.geojson src/convert/*
	$(node) src/convert/main.js \
		temp/map.geojson temp/ucty_map.js \
		$(cut_x0) $(cut_y0) $(cut_x1) $(cut_y1)

temp/map.geojson : input/map.osm
	mkdir -p temp
	$(osm2gj) input/map.osm > temp/map.geojson



#
# INPUT FOLDER
#

input/map.osm:
	curl -o input/map.osm http://overpass-api.de/api/map?bbox=$(src_x0),$(src_y0),$(src_x1),$(src_y1)
