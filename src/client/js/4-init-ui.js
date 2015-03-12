"use strict";


function ui_setpos(element, left, top, right, bottom, z)
{
	element.style.position = "absolute";
	if(left   !== undefined) element.style.left   = left+"px";
	if(top    !== undefined) element.style.top    = top+"px";
	if(right  !== undefined) element.style.right  = right+"px";
	if(bottom !== undefined) element.style.bottom = bottom+"px";
	if(z      !== undefined) element.style.zIndex = z_base + z;
}


function ui_draw_tabs()
{
	var tabs = global_tabs;
	var text = ["Offline", "Online"];
	
	// initially creation
	if(!global_tabs.length)
	{
		for(var i=0;i<2;i++)
		{
			var tab = document.createElement("div");
			ui_setpos(tab, i?190:40, 10, undefined, undefined, 2);
			tab.style.height = "20px";
			tab.style.width  = "50px";
			tab.style.padding = "10px 50px";
			tab.style.display = "block";
			tab.innerHTML = text[i];
			
			global_overlay.appendChild(tab);
			tabs[i] = tab;
		}
		global_tab_active_element = tabs[0];
	}
	
	// stuff that depends on is_active
	for(var i=0;i<2;i++)
	{
		var tab = tabs[i];
		var a = (tab == global_tab_active_element)
		var s = tab.style;
		
		s.borderTop = a ? "5px solid "+ui_color_main :
			"5px solid transparent";
		s.borderBottom = a ? "5px solid white" : "";
		s.backgroundColor = a ? "white" : "";
		s.cursor = a ? "default" : "pointer";
		
		tab.onmouseover = a ? null : function()
		{
			this.style.borderTop = "5px solid "+ui_color_alt;
		};
		tab.onmouseout = a ? null : ui_draw_tabs;
		tab.onclick = a ? null : function()
		{
			global_tab_active_element = this;
			ui_draw_tabs();
		}
		
		global_tab_content[i].style.display = a ? "block" : "none";
	}
}

function ui_draw_main()
{
	if(!global_ui_main)
	{
		var main = document.createElement("div");
		var bbox  = global_ui_content_bbox;
		ui_setpos(main, bbox[0], bbox[1], bbox[2], bbox[3], 1);
		main.style.backgroundColor = "white";
		main.style.borderTop
			= main.style.borderBottom
			= "5px solid" + ui_color_main;
		global_overlay.appendChild(main);
		global_ui_main = main;
	}
}

function ui_draw_question(marker_x, marker_y)
{
	if(!global_ui_question)
	{
		var q = document.createElement("div");
		q.style.padding = "10px 20px";
		q.style.cursor = "default";
		q.style.fontSize = ui_font_big;
		q.style.backgroundColor = "white";
		q.style.textAlign = "center";
		q.innerHTML="Koordinaten übernehmen?";
		q.style.display = "none";
		q.style.height = "100px";
		q.style.width  = "300px";
		q.style.paddingTop = "20px";
		
		q.style.borderBottom
		= q.style.borderTop
		= "5px solid" +ui_color_main;
		
		// yes, no
		for(var is_yes=0;is_yes<2;is_yes++)
		{
			var answer = document.createElement("div");
			answer.style.width = "100px";
			answer.style.height = "30px";
			answer.style.textAlign = "center";
			answer.style.cursor = "pointer";
			answer.onmouseover=function()
			{
				this.style.borderBottom = "5px solid"+ui_color_main;
			};
			answer.onmouseout=function()
			{
				this.style.borderBottom = "5px solid"+ui_color_alt;
			};
			answer.onmouseout();
			
			answer.onclick = is_yes
				? function()
				{
					global_long_elem.value = global_selection[0];
					global_lat_elem.value  = global_selection[1];
					global_selection = false;
					global_overlay.style.display = "none";
				}
				: function()
				{
					global_selection = false;
					draw();
				}
			;
			answer.innerHTML = is_yes ? "Ja" : "Nein";
			ui_setpos(answer, (is_yes?50:180), 70);
			q.appendChild(answer);
		}
		
		
		
		
		global_overlay.appendChild(q);
		global_ui_question = q;
	}
	
	var q = global_ui_question;
	
	if(marker_x)
	{
		var x = marker_x - 150;
		var y = marker_y - 120;
		if(y<5) y = marker_y + 100;
		
		if(x<5) x = 5;
		var x_max = global_canvas.clientWidth - 305;
		if(x > x_max) x = x_max;
		
		q.style.display = "block";
		ui_setpos
		(
			q,
			x,
			y,
			undefined,
			undefined,
			3
		);
	}
}

function ui_draw_x()
{
	if(!global_ui_x)
	{
		var x = document.createElement("div");
		ui_setpos(x, undefined, 0, 10);
		x.style.fontFamily = "monospace";
		x.style.fontSize   = "30pt";
		x.style.padding = "10px";
		x.style.cursor = "pointer";
		x.style.color = ui_color_alt;
		x.onmouseover = function(){this.style.color=ui_color_main;}
		x.onmouseout  = function(){this.style.color=ui_color_alt;}
		x.innerHTML="x";
		x.onclick = function()
		{
			global_overlay.style.display = "none";
		}
		global_overlay.appendChild(x);
	}
}

function ui_draw_content()
{
	for(var is_online=0;is_online<2;is_online++)
	{
		if(global_tab_content[is_online]) continue;
		
		var content = document.createElement("div");
		ui_setpos(content, 0, 0, 0, 0);
		global_ui_main.appendChild(content);
		global_tab_content[is_online] = content;
		
		if(!is_online)
		{
			var canvas = document.createElement("canvas");
			ui_setpos(canvas, 0,0,0,0);
			content.appendChild(canvas);
			global_canvas = canvas;
			
			// canvas.onclick = input_canvas_mouseclick;
			canvas.onmousemove = input_canvas_mousemove;
			addWheelListener(global_canvas,input_canvas_mouseweel);
			
			
			// Tried to use the HTML5 drag 'n' drop API first,
			// but it only makes everything more complicated.
			// (after all, this isn't drag 'n' drop, just drag ;))
			
			canvas.onmousedown = function(e)
			{
				global_mousedown_coords = [e.clientX, e.clientY];
				global_dragged = false;
			}
			canvas.onmouseup = function(e)
			{
				var old = global_mousedown_coords;
				if(!global_dragged) input_canvas_mouseclick(e);
				
				this.style.cursor = "default";
				global_mousedown_coords = false;
			}
			
			
			var msg = document.createElement("pre");
			ui_setpos(msg, undefined, undefined, 0, 0);
			msg.style.padding = "20px";
			msg.style.fontSize = ui_font_big;
			msg.style.textAlign = "right";
			global_ui_message = msg;
			content.appendChild(msg);
		}
	}
}


function init_ui(target_el_lat, target_el_long)
{
	if(!global_overlay)
	{
		var overlay = document.createElement("div");
		ui_setpos(overlay,0,0,0,0,1);
		overlay.style.backgroundColor = "rgba(165, 165, 165, 0.78)";
		document.body.appendChild(overlay);
		global_overlay = overlay;
		
		var lat  = target_el_lat  ? target_el_lat.value  : null;
		var long = target_el_long ? target_el_long.value : null;
		
		ui_draw_x();
		ui_draw_main();
		ui_draw_content();
		ui_draw_question();
		ui_draw_tabs();
	}
	
	
	// ui_tab_activate(global_tabs[0]);
	global_overlay.style.display = "block";
}
