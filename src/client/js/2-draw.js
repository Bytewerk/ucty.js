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
	var drawn = 0;
	var skipped = 0;
	for(var i=0;i<count;i++)
	{	
		var entry = global_enhanced_map[i];
		if(entry.line || entry.type == "area") continue;
		
		
		// estimate if the polygon is visible
		// TODO: this seems to always skip?
		var se = global_screen_edges;
		var bb  = entry.bbox;
		
		if(bb[0] > se[2] || bb[1] > se[3]
			|| bb[2] < se[0] || bb[3] < se[1] )
		{
			skipped++;
			continue;
		}
		
		global_c2.fillStyle   = global_colors[entry.type]
			|| global_colors["default"];
		global_c2.globalAlpha = 0.3;
		
		for(var j=0;j<entry.crds.length;j++)
			draw_group(entry.crds[j], entry.name);
		
		/*
		// debug: draw bounding box
		global_c2.strokeStyle = "red";
		global_c2.lineWidth = 1;
		global_c2.beginPath();
		global_c2.moveTo(draw_x(bb[0]), draw_y(bb[1]));
		global_c2.lineTo(draw_x(bb[2]), draw_y(bb[1]));
		global_c2.lineTo(draw_x(bb[2]), draw_y(bb[3]));
		global_c2.lineTo(draw_x(bb[0]), draw_y(bb[3]));
		global_c2.closePath();
		global_c2.stroke();
		*/
		
		drawn++;
	}
	return drawn;
}

function draw_calc_boundaries()
{
	var cx = global_center_x;
	var cy = global_center_y;
	var z  = global_zoom;
	var c  = global_canvas;
	
	
	// get the screen edges in geo coords
	var se = [0, 0, c.width, c.height];
	
	se[0] = + cx - (c.width /z) / 2;
	se[1] = + cy + (c.height/z) / 2 - c.height/z;
	se[2] = + cx - (c.width /z) / 2 + c.width/z;
	se[3] = + cy + (c.height/z) / 2;
	
	global_screen_edges = se;
	
	/* debug: draw big dots in the corners for visual verification
	var c2 = global_c2;
	c2.beginPath();
	c2.arc(draw_x(se[0]), draw_y(se[1]), 5, 0, 2 * Math.PI, false);
	c2.fillStyle = 'green';
	c2.fill();
	
	c2.beginPath();
	c2.arc(draw_x(se[2]), draw_y(se[3]), 5, 0, 2 * Math.PI, false);
	c2.fillStyle = 'red';
	c2.fill();
	*/
}

// call draw_calc_boundaries first!
function coord_is_off_screen(x,y)
{
	var se = global_screen_edges;
	
	return x < se[0] || x > se [2]
		|| y < se[1] || y > se [3];
}

function draw_labels()
{
	global_c2.strokeStyle = "black";
	global_c2.lineWidth = 1;
	var drawn = 0;
	
	for(var i=0;i<global_enhanced_map.length;i++)
	{
		var entry = global_enhanced_map[i];
		
		if(!entry.name
			|| coord_is_off_screen(entry.ctrx,entry.ctry))
				continue;
			
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
		
		drawn++;
		
		// hard limit
		if(drawn == global_max_labels)	break;
	}
	return drawn;
}

function draw()
{
	global_c2.clearRect(0,0,global_canvas.width,global_canvas.height);
	draw_calc_boundaries();
	
	var entries  = global_enhanced_map;
	
	// objects total
	var obj_count = global_zoom / 30 + 500;
	if(obj_count > entries.length) obj_count = entries.length;
	
	var obj_drawn = draw_polygons(obj_count);
	var label_drawn = draw_labels();
	
	
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
		+ "Objects:  "+obj_drawn+"/"+Math.floor(obj_count)+"/"+entries.length+"\n"
		+ "Labels:   "+label_drawn;
		
	draw_calc_boundaries();
}
