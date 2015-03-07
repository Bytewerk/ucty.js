var calc = require("./calc.js");
var cfg_precision = 5;
var cfg_precision_line = 4;

exports.addr = function(prop)
{
	if(prop["addr:street"] && prop["addr:housenumber"])
		return prop["addr:street"] + " " + prop["addr:housenumber"];
	if(prop["addr:street"])
		return prop["addr:street"];
	if(prop["addr:housenumber"])
		return prop["addr:housenumber"];
	
	return "";
}


exports.line = function(cutoff, feat)
{
	// it's all about the captions!
	var prop = feat.properties;
	var caption = prop.name || exports.addr(prop);
	if(!caption) return null;
	
	
	// remove all points, that are out of bounds
	var coords = feat.geometry.coordinates;
	for(var i=0;i<coords.length;i++)
	{
		if(calc.bbox_contains_point(cutoff, coords[i][0], coords[i][1]))
			continue;
		coords.splice(i,1);
		i--;
	}
	if(!coords.length) return null;
	
	
	// we won't draw the whole line anyway, so just
	// give back the coords of some point in the middle
	// to display the label right
	var center_coords = calc.round
	(
		coords[Math.floor(coords.length / 2)],
		cfg_precision_line
	);
	var type = prop.natural
		|| (prop.waterway ? "water" : "")
		|| (prop.highway ? "street" : "")
		|| prop.type
		|| "";
	var width = prop.width;
	
	
	return [
		type,
		caption,
		center_coords,
		calc.line_area(width, coords)
	];
}


function fix_caption(feat, points)
{
	// only do this for buildings, otherwise we'd
	// have strange side effects!
	if(!feat.properties.building) return "";
	
	
	var bbox = calc.bbox(feat.geometry.coordinates);
	
	// only do this for small objects!
	var size = calc.bbox_size(bbox);
	
	
	if(size < 0.001) for(var i=0;i<points.length;i++)
	{
		var x = points[i].x;
		var y = points[i].y;
		
		if( x >= bbox[0] && x <= bbox[2]
		 && y >= bbox[1] && y <= bbox[3])
		{
			// remove used entry from array
			// points.splice(i,1);
			
			return points[i].label;
		}
	}
	return "";
}

exports.polygon = function(cutoff, feat, points)
{
	// remove all points, that are out of bounds
	var coords = feat.geometry.coordinates;
	for(var i=0;i<coords.length;i++)
	{
		var group = coords[i];
		for(var j=0;j<group.length;j++)
		{
			if(calc.bbox_contains_point(cutoff, group[j][0], group[j][1]))
				continue;
			
			group.splice(j,1);
			j--;
		}
		
		if(group.length)
			continue;
		
		coords.splice(i,1);
		i--;
	}
	if(!coords.length) return null;
	
	coords = calc.round(coords, cfg_precision);
	
	var prop = feat.properties;
	var type = prop.natural
		|| (prop.building ? "building" : "")
		|| (prop.area ? "area" : "")
		|| (prop.waterway ? "water" : "")
		|| (prop.highway ? "street" : "")
		|| prop.type
		|| "";
	var caption = prop.name
		|| exports.addr(prop)
		|| fix_caption(feat, points);
	
	return [type, caption, coords];
}
