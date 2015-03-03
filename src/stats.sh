#!/bin/sh
echo "--------------------"
echo "        INPUT"
echo "--------------------"
du input/map.osm

echo "--------------------"
echo "      TEMPORARY     "
echo "--------------------"
du temp/map.geojson
du temp/ucty_map.js
du temp/ucty_client_and_map.ugly

echo "--------------------"
echo "       OUTPUT"
echo "--------------------"
du -c out/ucty.bin out/ucty.js
