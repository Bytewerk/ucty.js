/*
	Directly using OSM as input isn't that easy, because it needs to
	be parsed XML already (duplicating the function of osmtojson).
	So just use the geojson file.
	
	Optimizations (xz'd output):
		- just ucty (precision 7):
			212 K
		- prec. 6:
			180 K
		- prec. 5:
			145 K
	
	
	npm install mathjs osmtogeojson
*/

if(process.argv.length < 4)
{
	console.log("Syntax: "+process.argv[0]+" "
		+process.argv[1]+" input.geojson output.ucty");
	process.exit(1);
}

var fs      = require("fs");
var file	= process.argv[2];
var math	= require("mathjs");

// config
var cfg_precision = 5;
var cfg_precision_line = 4;
// config end


console.log("loading map "+file+"...");
var input	= JSON.parse(fs.readFileSync(file));

// recursively round all members of obj
function round(obj, precision)
{
	if(typeof obj == "number")
	{
		return math.round(obj, precision);
	}
	else
	{
		for(var i=0;i<obj.length;i++)
			obj[i] = round(obj[i], precision);
		return obj;
	}
}


console.log("converting to µcty format...");

var output = [];
var i;
for(i=0;i<input.features.length;i++)
{
	var feature = input.features[i];
	var prop = feature.properties;
	var line = feature.geometry.type == "LineString";
	
	// skip bus stops etc.
	if(feature.geometry.type == "Point")
		continue;
	
	if(prop.boundary) continue;
	
	var ucty_type = prop.natural
		|| (prop.building ? "building" : "")
		|| (prop.area ? "area" : "")
		|| (prop.waterway ? "water" : "")
		|| (prop.highway ? "street" : "")
		|| prop.type
		|| "";
	var ucty_caption = prop.name
		||  prop["addr:housenumber"]
		|| "";
	
	var ucty_coords = round(feature.geometry.coordinates,
		line ? cfg_precision_line : cfg_precision);
	
	var ucty_entry =
	[
		ucty_type,
		ucty_caption,
		ucty_coords
	];
	
	
	if(line) ucty_entry.push(prop.width);
	
	output.push(ucty_entry);
}

console.log("Total entries: "+i);

console.log("Writing to disk...");
fs.writeFileSync(process.argv[3], "var map="+JSON.stringify(output)+";");
console.log("Done!");

