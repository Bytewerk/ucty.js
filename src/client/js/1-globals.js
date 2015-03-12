"use strict";
/*
	All variables in here are global in the scope of the ucty script.
	They will not be globals after the script is compiled, because
	uglify encloses them and all functions in one anonymous object
	(that executes init() immediatelly).
*/

// The variable 'map' is currently also global.
// It does not have a prefix yet.

var global_enhanced_map;
var global_polys = [];
var global_labels = [];

var global_max_labels = 20;
var global_max_polys  = 300;

// set by init();
// [x0, y0, x1, y1]
var global_map_edges = [null, null, null, null];
var global_center_x;
var global_center_y;
var global_zoom;
var global_init_complete = false;
var global_long_elem;
var global_lat_elem;


// workaround for Qupzilla:
// the e.pageX and Y don't get set when scrolling
var global_last_page;


// set by draw_calc_boundaries()
// [x0, y0, x1, y1]
var global_screen_edges = [null, null, null, null];


// UI related
var global_overlay;
var global_tabs = [];
var global_tab_active_element;
var global_tab_content = [];
var global_ui_main;
var global_ui_x;
var global_ui_message;
var global_ui_question;
var global_ui_content_bbox = [20, 54, 20, 20];
var ui_color_main = "#dc0067";
var ui_color_alt  = "#ffb400";
var ui_font_big   = "15pt";
var z_base = 1e5;


// drag
var global_dragged = false;
var global_mousedown_coords = null;


var global_info   = document.getElementById("info");
// var global_debug  = document.getElementById("debug");
var global_canvas;
var global_c2;
// var global_canvas = document.getElementById("mapc");
//var global_c2     = global_canvas.getContext("2d");


// type:
// water,multipolygon,building,area,boundary,wood,,scrub,heath,grassland,tree_row,peak,tree,enforcement,Paketbox,E-Bike-Ladestation
// TODO: don't even add non-needed types: boundary, E-Bike-Ladestation, ...
var global_colors =
{
	"water" : "blue",
	"building": "grey",
	"wood" : "green",
	"scrub" : "green",
	"tree_row" : "green",
	"peak" : "brown",
	"street" : "#666666",
	"default" : "orange"
}


var global_timeout_draw = null;
var global_redraw = false;
var global_is_drawing = false;

var global_selection = false; // [x,y]

