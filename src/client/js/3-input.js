"use strict";

window.onkeyup = function(e)
{
	var move = 20 / global_zoom;
	var k = e.keyCode;
	
	// zoom in
	if([107,171,187].indexOf(k)>-1) draw(global_zoom *= 1.1);
	
	// zoom out
	if([109,173,189].indexOf(k)>-1) draw(global_zoom /= 1.1);
	
	// up
	if([38,75,87].indexOf(k)>-1) draw(global_center_y+= move);
	
	// down
	if([40,74,83].indexOf(k)>-1) draw(global_center_y-= move);
	
	// left
	if([37,72,65].indexOf(k)>-1) draw(global_center_x-= move);
	
	// right
	if([39,76,68].indexOf(k)>-1) draw(global_center_x+= move);
};


// returns an [x,y] array
function mouse_to_geo(e)
{
	
	// Workaround: Qupzilla doesn't set e.pageX for scroll events
	if(e.pageX && e.pageY)
		global_last_page = [e.pageX, e.pageY];
	else
	{
		e.pageX = global_last_page[0];
		e.pageY = global_last_page[1];
	}
	
	var x = e.pageX - global_ui_content_bbox[0];
	var y = e.pageY - global_ui_content_bbox[1];
	
	var map_width  = global_canvas.width  / global_zoom;
	var map_height = global_canvas.height / global_zoom;
	
	var geo_x = +x/global_zoom + global_center_x - map_width / 2;
	var geo_y = -y/global_zoom + global_center_y + map_height / 2;	
	
	return [geo_x, geo_y];
}

// arguments must be geo coords
// TODO: abort this function, when the mouse has moved
// to speed it up in firefox
function full_label(x, y)
{
	var ret = [];
	
	var add = function(entry)
	{
		var label = entry.name;
		if(ret.indexOf(label) == -1)
			ret.push(label);
	}
	
	// iterate over all labels,
	// find the ones that are at the mouse position
	// (or very near) and add all of them to the
	// ret array
	// FIXME: calculate, if the cursor is exactly
	// inside the area!
	for(var i=0;i<global_labels.length;i++)
	{
		var entry = global_labels[i];
		
		// as long as we only use the bounding box,
		// water mostly shows up in the wrong places.
		if(entry.type == "water")
			continue;
		
		if(entry.line)
		{
			// FIXME: the entry.size is too small!
			var x0 = entry.ctrx - entry.size/2;
			var y0 = entry.ctry - entry.size/2;
			var x1 = entry.ctrx + entry.size/2;
			var y1 = entry.ctry + entry.size/2;
			
			if( x > x0 && x < x1
			 && y > y0 && y < y1)
				add(entry);
		}
		else
		{
			var bb = entry.bbox;
			if( x > bb[0] && x < bb[2]
			 && y > bb[1] && y < bb[3])
				add(entry);
		}
	}
	return ret.reverse();
}


function input_timeout_draw()
{
	// When there are multiple scroll events,
	// only redraw every 10 ms
	if(global_timeout_draw) clearTimeout(global_timeout_draw);
	else draw();
	global_timeout_draw = setTimeout(draw,10);
}

function input_canvas_mousemove(e)
{
	var old = global_mousedown_coords;
	if(old && (old[0] != e.clientX || old[1] != e.clientY))
	{
		global_dragged = true;
		global_selection = false;
		global_canvas.style.cursor = "all-scroll";
		
		global_center_x -= (e.clientX - old[0]) / global_zoom;
		global_center_y += (e.clientY - old[1]) / global_zoom;
		global_mousedown_coords = [e.clientX, e.clientY];
		
		
		input_timeout_draw();
	}
	else
	{
		var geo = mouse_to_geo(e);
		global_ui_message.innerHTML =
			full_label(geo[0],geo[1]).join("\n");
	}
}

function input_canvas_mouseweel(e)
{
	var geo = mouse_to_geo(e);
				
	global_center_x += (geo[0] - global_center_x) * 0.05;
	global_center_y += (geo[1] - global_center_y) * 0.05;
	
	if(e.deltaY > 0)
		global_zoom /= 1.05;
	else
		global_zoom *= 1.05;
	
	input_timeout_draw();
	e.preventDefault();
}

function input_canvas_mouseclick(e)
{
	var geo = mouse_to_geo(e);
	global_selection = geo;
	draw();
}

// FIXME: rename function - redraw_content() or something?
function input_resize()
{	
	if(global_tab_active_element == global_tabs[0] && global_c2)
	{
		// offline map
		global_canvas.width  = global_tab_content[0].clientWidth;
		global_canvas.height = global_tab_content[0].clientHeight;
		draw();
	}
	
	if(global_tab_active_element == global_tabs[1] && global_qrcanvas)
	{
		global_qrtext.style.display =
			global_online_script_loaded ? "none" : "block";
		
		// online map
		if(global_online_script_loaded) // 
		{
			// We actually have an internet connection, so
			// load the online map!
			online_resize();
		}
		else
		{
			/*
				No internet connection!
				Just draw a QR code and info text.
			*/
			var w = global_tab_content[1].clientWidth;
			var h = global_tab_content[1].clientHeight;
			
			
			if(w > 1.5*h)
			{
				var qr_width = h - 100;
				
				// widescreen: display text and qrcode next to each other!
				
				ui_setpos(global_qrtext, 50, 50, qr_width + 100, 50);
				ui_setpos(global_qrcanvas, w -qr_width -50, 50, 50, 50);
				
				global_qrcanvas.width  = qr_width;
				global_qrcanvas.height = qr_width;
			}
			else
			{
				// put the qrcode below the text
				var qr_width = h - 200;
				ui_setpos(global_qrtext, 50, 50, 50, qr_width + 50);
				ui_setpos(global_qrcanvas, 50, 150, 50, 50);
				
				global_qrcanvas.width  = qr_width;
				global_qrcanvas.height = qr_width;
			}
			ui_draw_qrcode();
		}
	}
}
window.onresize = input_resize;



