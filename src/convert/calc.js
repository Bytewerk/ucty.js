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
		for(var i=0;i<obj.length;i++)
			obj[i] = exports.round(obj[i], precision);
		return obj;
	}
}
