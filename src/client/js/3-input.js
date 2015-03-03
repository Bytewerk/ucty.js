"use strict";

window.onkeyup = function(e)
{
	var move = 20 / global_zoom;
	var k = e.keyCode;
	
	if(k == 171) return draw(global_zoom *= 1.1); // +
	if(k == 173) return draw(global_zoom /= 1.1); // -
	if(k == 38 || k == 75) return draw(global_center_y+= move); // up
	if(k == 40 || k == 74) return draw(global_center_y-= move); // down
	if(k == 37 || k == 72) return draw(global_center_x-= move); // left
	if(k == 39 || k == 76) return draw(global_center_x+= move); // right
};


// returns an [x,y] array
function mouse_to_geo(e)
{
	// we assume that the border size is the same on all sides
	var border = (global_canvas.offsetWidth - global_canvas.clientWidth)/2;
	var x = e.pageX - global_canvas.offsetLeft - border;
	var y = e.pageY - global_canvas.offsetTop - border;
	
	var map_width  = global_canvas.width  / global_zoom;
	var map_height = global_canvas.height / global_zoom;
	
	var geo_x = +x/global_zoom + global_center_x - map_width / 2;
	var geo_y = -y/global_zoom + global_center_y + map_height / 2;	
	
	return [geo_x, geo_y];
}

global_canvas.onmousemove = function(e)
{	
	var geo = mouse_to_geo(e);
	
	global_info.innerHTML=
		"Mouse X:  " + geo[0] + "\n" +
		"Mouse Y:  " + geo[1]
	;
}

/*
global_canvas.onclick = function(e)
{
	var geo = mouse_to_geo(e);
	
	var x = draw_x(geo[0]);
	var y = draw_y(geo[1]);
	
	global_c2.strokeStyle = '#000'; 
    global_c2.beginPath();
    global_c2.arc(x,y,10, 0, 2* Math.PI, false);
    global_c2.fillStyle = "green";
    global_c2.fill();
    global_c2.closePath();  
}
*/

addWheelListener(global_canvas,function(e)
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
});
