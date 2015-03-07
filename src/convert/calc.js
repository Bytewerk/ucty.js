/*
	Geometrical and other math functions are here
*/
var math = require("mathjs");


exports.line_area = function(width, coords)
{
	var len=0;
	// calculate line length
	// http://www.mathopenref.com/coorddist.html
	for(var i=0;i<coords.length-1;i++)
	{
		var x0 = coords[i][0];
		var y0 = coords[i][1];
		var x1 = coords[i+1][0];
		var y1 = coords[i+1][1];
		
		len += Math.pow
		(
			Math.pow((x0-x1),2) + Math.pow((y0-y1),2), 0.5
		);
	}

	// TODO: optimize this.
	return len * width / 40000;
}


// recursively round all members of obj
exports.round = function(obj, precision)
{
	if(typeof obj == "number")
	{
		return math.round(obj, precision);
	}
	else
	{
		if(!obj)
		{
			console.log(new Error("calc.round: invalid object!").stack);
			return obj;
		}
		for(var i=0;i<obj.length;i++)
			obj[i] = exports.round(obj[i], precision);
		return obj;
	}
}

// calculate the bounding box, as in
// client/js/*-init.js
exports.bbox = function(coords)
{
	var bbox = [null, null, null, null];
	
	for(var i=0;i<coords.length;i++)
		for(var j=0;j<coords[i].length;j++)
		{
			var x = coords[i][j][0];
			var y = coords[i][j][1];
			
			if(bbox[0] === null || x < bbox[0]) bbox[0] = x;
			if(bbox[1] === null || y < bbox[1]) bbox[1] = y;
			if(bbox[2] === null || x > bbox[2]) bbox[2] = x;
			if(bbox[3] === null || y > bbox[3]) bbox[3] = y;
		}
	return bbox;
}

// return diagonal length
exports.bbox_size = function(bbox)
{
	return Math.pow(Math.pow(bbox[2]-bbox[0],2)
		+ Math.pow(bbox[3] - bbox[1],2),0.5);
}

exports.bbox_contains_point = function(bbox, x, y)
{
	return x >= bbox[0] && x <= bbox[2] && y >= bbox[1] && y <= bbox[3];
}



