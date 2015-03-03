"use strict";


function draw_x(x)
{
	var map_width = global_canvas.width / global_zoom;
		
	return (x - global_center_x + map_width/2) * global_zoom;
}

function draw_y(y)
{
	var map_height = global_canvas.height / global_zoom;
	
	return -(y - global_center_y - map_height/2) * global_zoom;
}

function draw_line_reset()
{
	global_c2.strokeStyle = "black";
	global_c2.lineWidth = 1.0;
}

function draw_line_street(w)
{
	var width = global_zoom / 40000 + 1;
	if(w) width *= 1 + w*0.2;
	
	global_c2.lineWidth = width;
}

function draw_group(group, name)
{
	global_c2.beginPath();
	
	for(var k=0;k<group.length;k++)
	{
		var x = draw_x(group[k][0]);
		var y = draw_y(group[k][1]);
		
		if(!k)	global_c2.moveTo(x,y);
		else	global_c2.lineTo(x,y);
	}
	
	// if(!x) console.log("error while drawing: "+name);
	
	global_c2.closePath();
	global_c2.fill();
	
	if(global_zoom > 100000)
	{
		draw_line_reset();
		global_c2.stroke();
	}
}

function draw_polygons(count)
{
	for(var i=0;i<count;i++)
	{	
		var entry = global_enhanced_map[i];
		if(entry.line || entry.type == "area") continue;
		
		global_c2.fillStyle   = global_colors[entry.type]
			|| global_colors["default"];
		global_c2.globalAlpha = 0.3;
		
		for(var j=0;j<entry.crds.length;j++)
			draw_group(entry.crds[j], entry.name);
	}
}

function draw_labels(count)
{
	global_c2.strokeStyle = "black";
	global_c2.lineWidth = 1;
	
	for(var i=0;i<count;i++)
	{
		var entry = global_enhanced_map[i];
		if(!entry.name) continue;
			
		var name = entry.name;
		if(name.length > 10)
			name = name.substr(0,10)+".";
		
		if(entry.type == "street")
			global_c2.globalAlpha = 0.5;
		else
			global_c2.globalAlpha = 1.0;
		
		global_c2.strokeText(name,
			draw_x(entry.ctrx),
			draw_y(entry.ctry)
		);
	}
}

function draw()
{
	global_c2.clearRect(0,0,global_canvas.width,global_canvas.height);
	
	
	var entries  = global_enhanced_map;
	
	// objects total
	var obj_count = global_zoom / 30 + 500;
	if(obj_count > entries.length) obj_count = entries.length;
	
	// labels total
	var label_count = global_zoom / 300 + 10;
	if(global_zoom > 200000 || label_count > entries.length)
		label_count = entries.length;
	
	draw_polygons(obj_count);
	draw_labels(label_count);
	
	
	// be nice and draw copyright info for OSM:
	// http://wiki.openstreetmap.org/wiki/Legal_FAQ#I_would_like_to_use_OpenStreetMap_maps._How_should_I_credit_you.3F
	draw_line_reset();
	global_c2.globalAlpha = 1.0;
	global_c2.strokeText("Map Data © OpenStreetMap Contributors",
		20.5,global_canvas.height - 20.5);


	debug.innerHTML
		= "Center X: "+global_center_x+"\n"
		+ "Center Y: "+global_center_y+"\n"
		+ "Zoom:     "+global_zoom+"\n\n"
		+ "Objects:  "+Math.floor(obj_count)+"/"+entries.length+"\n"
		+ "Labels:   "+Math.floor(label_count);
}
