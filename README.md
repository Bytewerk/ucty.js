# µcty.js
openstreetmap in a box (proof of concept)

## demo
[Here.](http://ucty.oakey-dev.eu/) You can zoom in by scrolling with the mouse (or press `+` and `-`) and navigate with the arrow keys. Works in Firefox and Chromium. Zoom in closely, and you'll see address numbers and street names. The decompression will take some time, be patient (maybe there'll be a progress bar in the future?)

## features (and non-features)
* convert [`OSM`](http://openstreetmap.org) files into minimal a minimal, `LZMA` compressed and lossy format
* view the whole map in your browser with a tiny `HTML5` canvas based client
* converter cuts off a given map at a bounding box (`OSM` files contain polygons that reach outside of the given export area)
* converter automatically combines building and point objects, that have the same location
* streets are only saved and shown as text, this saves lots of file space (orientation with buildings is good enough)
* no rotated text (faster rendering, less complicated code!). Instead long names get shortened, you'll see the full name by hovering the polygons with the mouse.
* required server: any `HTTPD` will do, that can host two files statically ;)


## minimalism
|OSM Size|µcty map incl. HTML5 client|
---------|---------------------------------
|10 MB| <150 KB|

## usage
Make sure that you have installed the latest `nodejs`. Then issue the following commands:
```shell
git clone https://github.com/Bytewerk/ucty.js.git
cd ucty.js
npm install osmtogeojson uglify-js mathjs
make
```
You can adjust the coordinates in the `Makefile`. Delete `input/map.osm` and run `make` again to download and compile the new map.
