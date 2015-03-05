if(process.argv.length < 4)
{
	console.log("Syntax: "+process.argv[0]+" "
		+process.argv[1]+" input.geojson output.ucty");
	process.exit(1);
}

var fs         = require("fs");
var file       = process.argv[2];
var conv_entry = require("./convert_entry.js");

console.log("loading map "+file+"...");
var input	= JSON.parse(fs.readFileSync(file));

// create a list of address-points here, so we can
// label polygons, that do not have a label yet
var points = [];
for(var i=0;i<input.features.length;i++)
{
	var feat = input.features[i];
	var geo = feat.geometry;
	if(geo.type != "Point") continue;
	
	var prop = feat.properties;
	var label = conv_entry.addr(prop);
	
	if(!label) continue;
	
	points.push
	({
		label: label,
		x: geo.coordinates[0],
		y: geo.coordinates[1]
	});
}




console.log("converting to µcty format...");

var output = [];
for(var i=0;i<input.features.length;i++)
{
	var feat = input.features[i];
	var geo  = feat.geometry.type;
	var is_line = (geo == "LineString");
	
	// skip these
	if(geo == "Point"
		|| feat.properties.boundary)
		continue;
	
	var entry = is_line ? conv_entry.line(feat)
		: conv_entry.polygon(feat, points);
	if(entry) output.push(entry);
}


console.log("Entries: "+output.length
	+" (of "+input.features.length+")");
fs.writeFileSync(process.argv[3],
	"var map="+JSON.stringify(output)+";");







