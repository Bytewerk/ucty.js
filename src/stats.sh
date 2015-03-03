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
echo "--------------------"



# create a "stats" folder to keep track
# of the stats. A new file gets created whenever
# the repo doesn't have any changes and a stats
# file of the current revision doesn't exist yet.

[ ! -d "stats" ] && exit 0
git diff-index --quiet HEAD -- || exit 0
[ "$1" != "" ] && exit 0

output="stats/$(git rev-parse HEAD).txt"
[ -e "$output" ] && exit 0

date >> "$output"
$0 "savingoutput" >> "$output"

echo "=> Stats saved to: $output"
