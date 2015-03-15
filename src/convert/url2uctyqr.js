/*
	This scripts converts an URL into a 'QR ucty' map (just a bunch of
	polygons, so we can use the same functions for drawing like with the
	regular map and save some space again).
	
*/
var qr = require("../qrcode/tz_qr_encoder");

console.log(qr.get_array("http://bytewerk.org"));
