#
# CONFIGURATION
#
node   = /bin/node
osm2gj = ./node_modules/osmtogeojson/osmtogeojson
uglify = ./node_modules/uglify-js/bin/uglifyjs
uflags = --compress unsafe --screw-ie8


# TODO: move this to config.js:
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
# FAKE TARGETS
#
.PHONY: all clean ugly

all: cfg/config.js out/client-data/ucty.bin out/client-data/ucty.js out/client-data/index_example.html
	src/stats.sh

clean:
	rm -r temp out || true

ugly:
	rm out/ucty.js temp/*.ugly || true
	make

cfg/config.js:
	$(info ERROR: Please create cfg/config.js first! See also: cfg/config.sample.js)
	exit 1


#
# CLIENT-DATA FOLDER
#

out/client-data/index_example.html: src/client/index_example.html
	mkdir -p out/client-data
	cp src/client/index_example.html out/client-data/index_example.html

out/client-data/ucty.bin: temp/ucty_client_and_map.ugly
	mkdir -p out/client-data
	lzma -k --stdout temp/ucty_client_and_map.ugly \
		> out/client-data/ucty.bin

out/client-data/ucty.js: temp/unlzma.js
	mkdir -p out/client-data
	$(uglify) $(uflags) --output out/client-data/ucty.js \
	--mangle sort,eval temp/unlzma.js


#
# ONLINE-DATA FOLDER
#

# TODO


#
# TEMP FOLDER
#

temp/unlzma.js: src/client/decompress.js src/lzma-js/lzma-d-min.js
	mkdir -p temp
	cat src/lzma-js/lzma-d-min.js src/client/decompress.js > temp/unlzma.js
	sed -i 's/"use strict";//g' temp/unlzma.js

temp/ucty_client_and_map.ugly: temp/ucty_client_and_map.js
	$(uglify) $(uflags) --enclose ucty \
		--output temp/ucty_client_and_map.ugly \
		--mangle sort,toplevel,eval \
		temp/ucty_client_and_map.js

temp/ucty_client_and_map.js: temp/qrdata.js temp/ucty_map.js src/client/js/*
	cat temp/qrdata.js temp/ucty_map.js src/client/js/* > temp/ucty_client_and_map.js
	sed -i 's/"use strict";//g' temp/ucty_client_and_map.js

temp/ucty_map.js: temp/map.geojson src/convert/geojson2uctymap.js src/convert/lib/*
	$(node) src/convert/geojson2uctymap.js \
		temp/map.geojson temp/ucty_map.js \
		$(cut_x0) $(cut_y0) $(cut_x1) $(cut_y1)

temp/qrdata.js: cfg/config.js src/convert/url2uctyqr.js src/qrcode/tz_qr_encoder.js
	mkdir -p temp
	$(node) src/convert/url2uctyqr.js


temp/map.geojson : input/map.osm
	mkdir -p temp
	$(osm2gj) input/map.osm > temp/map.geojson



#
# INPUT FOLDER
#

input/map.osm:
	curl -o input/map.osm http://overpass-api.de/api/map?bbox=$(src_x0),$(src_y0),$(src_x1),$(src_y1)
