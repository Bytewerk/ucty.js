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
		var crds = map[i][2];
		var line = (typeof crds[0][0] == "number"); // bool
		var width = map[i][3];
		
		
		var total_area = 0;
		var centroid_x = 0;
		var centroid_y = 0;
		var centroid_i = 0;
		
		if(line)
		{
			// calculate line length
			// http://www.mathopenref.com/coorddist.html
			for(var j=0;j<crds.length-1;j++)
			{
				var x0 = crds[j][0];
				var y0 = crds[j][1];
				var x1 = crds[j+1][0];
				var y1 = crds[j+1][1];
				
				total_area += Math.pow
				(
					Math.pow((x0-x1),2) + Math.pow((y0-y1),2), 0.5
				);
			}
			total_area *= width / 40000;
			
			// don't calculate the real centroid, but use some
			// point in the middle. should be good enough.
			var middle = crds[Math.floor(crds.length / 2)];
			centroid_x = middle[0];
			centroid_y = middle[1];
		}
		else
		{
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
				}
				total_area += area / 2;
			}
			
			centroid_x /= centroid_i;
			centroid_y /= centroid_i;
		}
		ret.push
		({
			line: line, // bool
			ctrx: centroid_x,
			ctry: centroid_y,
			size: total_area,
			type: map[i][0],
			name: map[i][1],
			crds: map[i][2],
			width: width
		});
	}
	return ret;
}


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
	
	draw();
}


init();
