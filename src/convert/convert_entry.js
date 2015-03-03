var calc = require("./calc.js");
var cfg_precision = 5;
var cfg_precision_line = 4;

exports.line = function(feat)
{
	// it's all about the captions!
	var prop = feat.properties;
	var caption = prop.name
		||  prop["addr:housenumber"]
		|| "";
	if(!caption) return null;
	
	
	var type = prop.natural
		|| (prop.waterway ? "water" : "")
		|| (prop.highway ? "street" : "")
		|| prop.type
		|| "";
	var coords = feat.geometry.coordinates;
	var width = prop.width;
	
	
	// we won't draw the line anyway, so just
	// give back the coords of some point in the middle
	// to display the label right
	center_coords = calc.round
	(
		coords[Math.round(coords.length / 2)],
		cfg_precision_line
	);
	
	return [
		type,
		caption,
		center_coords,
		calc.line_area(width, coords)
	];
}


exports.polygon = function(feat)
{
	var prop = feat.properties;
	var type = prop.natural
		|| (prop.building ? "building" : "")
		|| (prop.area ? "area" : "")
		|| (prop.waterway ? "water" : "")
		|| (prop.highway ? "street" : "")
		|| prop.type
		|| "";
	
	// FIXME: attach missing numbers to buildings,
	// which are stored as "Point"
	var caption = prop.name
		||  prop["addr:housenumber"]
		|| "";
	
	var coords = calc.round(feat.geometry.coordinates,
		cfg_precision);
	
	return [type, caption, coords];
}
