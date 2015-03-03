"use strict";

function init_enhance_line(entry)
{
	return {
		line: true,
		type: entry[0],
		name: entry[1],
		ctrx: entry[2][0],
		ctry: entry[2][1],
		size: entry[3]
	};
}

function init_enhance_polygon(entry)
{
	var crds = entry[2];
	var total_area = 0;
	var centroid_x = 0;
	var centroid_y = 0;
	var centroid_i = 0;
	
	// centroid: http://en.wikipedia.org/wiki/Centroid#Of_a_finite_set_of_points
	// http://stackoverflow.com/a/451482
	for(var j=0; j<crds.length; j++)
	{
		var group = crds[j];
		var area = 0;
		for(var k=0;k<group.length;k++)
		{
			var x0 = group[k][0];
			var y0 = group[k][1];
			var x1,y1;
			
			// x1,y1 are either the next ones
			// or the first ones.
			if(group[k+1])
			{
				x1 = group[k+1][0];
				y1 = group[k+1][1];
			}
			else
			{
				x1 = group[0][0];
				y1 = group[0][1];
			}
			
			area += x0 * y1 - x1 * y0;
			
			centroid_x += x0;
			centroid_y += y0;
			centroid_i++;
			
			// we are already iterating over all points,
			// so find the edges, too:
			init_find_edges(x0, y0);
		}
		total_area += area / 2;
	}
	
	centroid_x /= centroid_i;
	centroid_y /= centroid_i;
	
	return {
		line: false,
		ctrx: centroid_x,
		ctry: centroid_y,
		size: total_area,
		type: entry[0],
		name: entry[1],
		crds: entry[2],
	};
}


/*
	adds object size to each object, returns a struct like:
	[{
		ctrx: // centroid for the label, x-pos
		ctry:
		size:
		type:
		name:
		crds: // coordinates
	}, ... ]
*/
function init_enhance_map()
{
	var ret = [];
	
	// add the surface size to each map element
	for(var i=0;i<map.length;i++)
	{	
		var is_line = (typeof map[i][2][0] == "number"); // bool
		
		var entry = is_line ? init_enhance_line(map[i])
			: init_enhance_polygon(map[i]);
		
		if(i<100 && is_line) console.log(entry);
		ret.push(entry);
	}
	return ret;
}

var init_find_edges = function(x, y)
{
	var e = global_map_edges;
	
	if(!e[0] || x < e[0]) e[0] = x;
	if(!e[2] || x > e[2]) e[2] = x;
	if(!e[1] || y < e[1]) e[1] = y;
	if(!e[3] || y > e[3]) e[3] = y;
	
	global_map_edges = e;
};

function init()
{	
	var map2 = init_enhance_map();
	
	// sort all maps by size, biggest first
	map2.sort(function(a,b)
	{
		if(a.size > b.size) return -1
		if(a.size < b.size) return +1;
		return 0;
	});
	
	global_enhanced_map = map2;
	
	// TODO: divide map in squares and get all IDs
	// of objects inside these squares
	console.log("objects on map: "+map2.length);
	console.log(JSON.stringify(global_map_edges));
	
	// [x0, y0, x1, y1]
	var e = global_map_edges;
	global_center_x = e[0] + (e[2] - e[0])/2;
	global_center_y = e[1] + (e[3] - e[1])/2;
	
	draw();
}


init();
