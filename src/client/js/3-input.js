"use strict";

window.onkeyup = function(e)
{
	var move = 20 / global_zoom;
	var k = e.keyCode;
	
	if(k == 171 || k == 107) return draw(global_zoom *= 1.1); // +
	if(k == 173 || k == 109) return draw(global_zoom /= 1.1); // -
	if(k == 38 || k == 75) return draw(global_center_y+= move); // up
	if(k == 40 || k == 74) return draw(global_center_y-= move); // down
	if(k == 37 || k == 72) return draw(global_center_x-= move); // left
	if(k == 39 || k == 76) return draw(global_center_x+= move); // right
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



function input_canvas_mousemove(e)
{
	var geo = mouse_to_geo(e);

	global_ui_message.innerHTML =
		full_label(geo[0],geo[1]).join("\n");
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
	
	// When there are multiple scroll events,
	// only redraw every 10 ms
	if(global_zoom_timeout) clearTimeout(global_zoom_timeout);
	else draw();
	global_zoom_timeout = setTimeout(draw,10);
	
	e.preventDefault();
}

function input_canvas_mouseclick(e)
{
	var geo = mouse_to_geo(e);
	global_selection = geo;
	draw();
}

function input_resize()
{
	if(!global_canvas) return;
	global_canvas.width  = global_tab_content[0].clientWidth;
	global_canvas.height = global_tab_content[0].clientHeight;
	draw();
}
window.onresize = input_resize;



