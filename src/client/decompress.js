"use strict";

// expect lzma-d-min.js to be loaded.
// https://github.com/nmrugg/LZMA-JS/tree/master/src


function ucty()
{
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "ucty.bin", true);
	xhr.responseType = "arraybuffer";
	xhr.onload = function()
	{
		if(xhr.status == 200) LZMA.decompress
		(
			new Uint8Array(xhr.response),
			eval
		)
	}
	xhr.send();
}
