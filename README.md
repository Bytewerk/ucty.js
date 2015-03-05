# µcty.js
openstreetmap in a box (proof of concept)

## demo
[Here.](http://ucty.oakey-dev.eu/) You can zoom in by scrolling with the mouse (or press `+` and `-`) and navigate with the arrow keys. Works in Firefox and Chromium. Zoom in closely, and you'll see address numbers and street names.

## features
* convert [`OSM`](http://openstreetmap.org) files into minimal a minimal, `LZMA` compressed and lossy format
* view the whole map in your browser with a tiny `HTML5` canvas based client
* server: any `HTTPD` will do, that can server two files statically ;)

## status
* this is the work of three days or so, don't expect all the features that you know from the normal open street map or google maps pages! Adding all of them isn't a goal either, as the output is optimized for file size.
* streets are only displayed as text. this will probably not change, orientation with the buildings seems to be enough.

## minimalism
|OSM Size|µcty map incl. HTML5 client|
---------|---------------------------------
|10 MB| <150 KB|

## usage
Make sure that you have installed the latest `nodejs`. Then issue the following commands:
```shell
git clone https://github.com/Bytewerk/ucty.js.git
cd ucty.js
npm install osmtogeojson uglify mathjs
make
```
