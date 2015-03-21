function online_draw_init()
{
	var tab = global_tab_content[1 /* online tab */] || document;
	
	var div = document.createElement("div");
	tab.appendChild(div);
	ui_setpos(div, 0, 0, 0, 0, 1);
	
	global_online_div = div;
	
}
function online_resize()
{
	if(!global_online_div) online_draw_init();
	online_draw();
}


function online_draw()
{
	var div = global_online_div;
	div.style.backgroundColor="green";
	console.log("online_draw: STUB");
}
