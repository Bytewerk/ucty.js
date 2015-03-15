/*
	This scripts converts an URL into the 'QR ucty' format.
	
	var global_qrdata =
	[
		[1, 0, 1, 1, ...], // 1st line
		... // other lines
	];
*/

var fs  = require("fs");
var qr  = require("../qrcode/tz_qr_encoder");
var cfg = require("../../cfg/config.js");
var url = cfg.online_url;
var out = "temp/qrdata.js";


fs.writeFileSync
(
	out,
	"var global_qrdata="
	+ JSON.stringify(qr.get_array(url))
	+";"
);
console.log("Encoded QR for URL: " + url);
