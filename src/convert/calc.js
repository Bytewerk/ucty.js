/*
	Geometrical and other math functions are here
*/
var math = require("mathjs");


exports.line_area = function()
{
	// TODO
	
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
