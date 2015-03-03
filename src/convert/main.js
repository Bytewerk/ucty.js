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


// TODO: create an optimized list of points here


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
		: conv_entry.polygon(feat);
	if(entry) output.push(entry);
}


console.log("Entries: "+output.length
	+" (of "+input.features.length+")");
fs.writeFileSync(process.argv[3],
	"var map="+JSON.stringify(output)+";");







