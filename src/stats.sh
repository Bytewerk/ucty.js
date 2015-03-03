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


# create a "stats" folder to keep track
# of the stats. A new file gets created whenever
# the repo doesn't have any changes and a stats
# file of the current revision doesn't exist yet.
if [ -d "stats" ] \
	&& git diff-index --quiet HEAD -- \
	&& "$1" == ""
then
	output="stats/$(git rev-parse HEAD).txt"
	date > "$output"
	$0 "savingoutput" > "$output"
	
	echo "--------------------"
	echo "=> Stats saved to: $output"
fi
