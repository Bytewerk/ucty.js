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

function draw_group(group)
{
	global_c2.beginPath();
	
	for(var k=0;k<group.length;k++)
	{
		var x = draw_x(group[k][0]);
		var y = draw_y(group[k][1]);
		
		if(!k)	global_c2.moveTo(x,y);
		else	global_c2.lineTo(x,y);
	}
	
	global_c2.closePath();
	global_c2.fill();
	
	if(global_zoom > 100000)
	{
		draw_line_reset();
		global_c2.stroke();
	}
}

function draw_polygons()
{
	var drawn = 0;
	for(var i=0;i<global_polys.length;i++)
	{
		if(global_redraw) return;
		
		var entry = global_polys[i];
		if(entry.line || entry.type == "area") continue;
		if(drawn >= global_max_polys && entry.type != "water") continue;
		
		
		// estimate if the polygon is visible
		var se = global_screen_edges;
		var bb  = entry.bbox;
		
		if(bb[0] > se[2] || bb[1] > se[3]
			|| bb[2] < se[0] || bb[3] < se[1] )
			continue;
		
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
	
	for(var i=0;i<global_labels.length;i++)
	{
		if(global_redraw) return;
		
		var entry = global_labels[i];
		
		if(!entry.short
			|| coord_is_off_screen(entry.ctrx,entry.ctry))
				continue;
			
		if(entry.type == "street")
			global_c2.globalAlpha = 0.5;
		else
			global_c2.globalAlpha = 1.0;
		
		global_c2.strokeText(entry.short,
			draw_x(entry.ctrx),
			draw_y(entry.ctry)
		);
		
		drawn++;
		
		// hard limit
		if(drawn == global_max_labels)	break;
	}
	return drawn;
}

function draw_marker()
{
	if(!global_selection)
	{
		global_ui_question.style.display = "none";
		return;
	}
	
	var x = draw_x(global_selection[0]);
	var y = draw_y(global_selection[1]);
	var c2 = global_c2;
	c2.strokeStyle = ui_color_main; 
	
	// outer circle
	c2.lineWidth = 4.0;
    c2.beginPath();
    c2.arc(x,y,15, 0, 2* Math.PI, false);
    c2.closePath();
    c2.stroke();
    
    // inner circle
	c2.lineWidth = 1.0;
    c2.beginPath();
    c2.arc(x,y,10, 0, 2* Math.PI, false);
    c2.closePath();
    c2.stroke();
    
    ui_draw_question(x, y);
}

function draw(no_is_drawing_check)
{
	if(!no_is_drawing_check && global_is_drawing)
		return global_redraw = true;
	
	global_redraw = false;
	global_is_drawing = true;
	
	global_c2.clearRect(0,0,global_canvas.width,global_canvas.height);
	draw_calc_boundaries();
	
	var obj_drawn = draw_polygons();
	if(global_redraw) return draw(true);
	var label_drawn = draw_labels();
	if(global_redraw) return draw(true);
	
	
	// be nice and draw copyright info for OSM:
	// http://wiki.openstreetmap.org/wiki/Legal_FAQ#I_would_like_to_use_OpenStreetMap_maps._How_should_I_credit_you.3F
	draw_line_reset();
	global_c2.globalAlpha = 1.0;
	global_c2.strokeText("Map Data © OpenStreetMap Contributors",
		20.5,global_canvas.height - 20.5);
/*
	debug.innerHTML
		= "Center X: "+global_center_x+"\n"
		+ "Center Y: "+global_center_y+"\n"
		+ "Zoom:     "+global_zoom+"\n\n"
		+ "Objects:  "+obj_drawn+"/"+global_polys.length+"\n"
		+ "Labels:   "+label_drawn+"/"+global_labels.length;
*/		
	draw_calc_boundaries();
	draw_marker();
	global_is_drawing = false;
}
