"use strict";

// expect lzma-d-min.js to be loaded.
// https://github.com/nmrugg/LZMA-JS/tree/master/src


function ucty(long_elem, lat_elem)
{
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "ucty.bin", true);
	xhr.responseType = "arraybuffer";
	xhr.onload = function()
	{
		if(xhr.status == 200) LZMA.decompress
		(
			new Uint8Array(xhr.response),
			function(code)
			{
				eval(code);
				ucty(long_elem, lat_elem);
			}
		)
	}
	xhr.send();
}
