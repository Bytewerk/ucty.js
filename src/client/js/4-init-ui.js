"use strict";

var ui_color_main = "#dc0067";
var ui_color_alt  = "#ffb400";
var ui_font_big   = "15pt";
var z_base = 1e5;


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
			ui_setpos(tab, i?190:40, 10, undefined, undefined, 10);
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
			// TODO: also show/hide corresponding div
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
		ui_setpos(main, bbox[0], bbox[1], bbox[2], bbox[3], 2);
		main.style.backgroundColor = "white";
		main.style.borderTop
			= main.style.borderBottom
			= "5px solid" + ui_color_main;
		global_overlay.appendChild(main);
		global_ui_main = main;
	}
}

function ui_draw_button()
{
	if(!global_ui_button)
	{
		var btn = document.createElement("div");
		btn.style.padding = "10px 20px";
		btn.style.cursor = "pointer";
		btn.style.fontSize = ui_font_big;
		// btn.style.backgroundColor = "white";
		btn.style.margin = "10px";
		btn.onmouseover = function()
		{
			this.style.borderBottom = "5px solid "+ui_color_main;
		};
		btn.onmouseout = function()
		{
			this.style.borderBottom = "5px solid "+ui_color_alt;
		};
		btn.onmouseout();
		ui_setpos(btn, undefined, 30, 30);
		global_ui_main.appendChild(btn);
		global_ui_button = btn;
	}
	
	global_ui_button.innerHTML= "OK";
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
			
			canvas.onmousemove = input_canvas_mousemove;
			addWheelListener(global_canvas,input_canvas_mouseweel);
			
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
		// ui_draw_button();
		ui_draw_tabs();
	}
	
	
	// ui_tab_activate(global_tabs[0]);
	global_overlay.style.display = "block";
}
