# µcty.js
browser-compatible minimum space geographical maps proof of concept

## features
* convert [`OSM`](http://openstreetmap.org) files into minimal a minimal, `LZMA` compressed and lossy format
* view the whole map in your browser with a tiny `HTML5` canvas based client
* server: any `HTTPD` will do, that can server two files statically ;)

## status
* this is the work of three days or so, don't expect all the features that you know from the normal open street map or google maps pages! Adding all of them isn't a goal either, as the output is optimized for file size.
* map size is limited by what the openstreetmap page can export right now
* streets aren't displayed at all

## minimalism
|OSM Size|µcty map incl. HTML5 client|
---------|---------------------------------
|10 MB| <150 KB|

## usage
Make sure that you have installed the latest `nodejs`. Then issue the following commands:
```shell
git clone https://github.com/robotanarchy/ucty.js.git
cd ucty.js
npm install osmtogeojson uglify mathjs
# (copy your map file to input/map.osm)
make
```
