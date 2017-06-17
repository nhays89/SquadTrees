/*
example input:

4 4
1011
0111
1010
0111
6 7
1110111
1010101
0000000
0100010
1011101
1010101
0 0


*/

function main(input) {

	var map = [];
	var stmts = input.split("\n");
	var img = [];
	var index = 0;
	while(true) {
		var dims = stmts[index++].split(" ");
		var r = dims[0];
		var c = dims[1];
		if(r == 0 && c == 0) break;
		for(var i = 0; i < r; i++) {
			var row = stmts[index++];
			img[i] = [];
			for(var j = 0; j < c; j++) {
				img[i][j] = row[j];
			}	
		}

		r = powerOf2(r);
		c = powerOf2(c);
		
		var path = "", lvl = 0, numOfCols = dims[0];
		quadtree(img, map, sRow, sCol, path, lvl, numOfCols);
		quicksort(map);
		compress(map);


	}
};

/*
	Recursively builds a quadtree from the img (2d array of binary integers) by inserting elements 
	into the map (an array of objects) iff every integer in the quadrant is the same.
	Map will contain the quadtree representation where
	each element will be an object composed of: 1) a binary string, 2) a path to each quadrant,
	and the level (base 4) of the object within the tree.
	
	For example: 

	img: 

	1011
	0111
	1010
	0111
	
	map:
	[
	{ binStr: 1001001000100011, lvl: 0, path: 0},
	{ binStr: 1001, lvl: 1, path: 00},
	{ binStr: 1111, lvl: 1, path: 01},
	{ binStr: 1001, lvl: 1, path: 02},
	{ binStr: 1011, lvl: 1, path: 03},
	{ binStr: 1, lvl: 2, path: 000},
	{ binStr: 0, lvl: 2, path: 001},
	{ binStr: 0, lvl: 2, path: 002},
	{ binStr: 1, lvl: 2, path: 003},
	{ binStr: 1, lvl: 2, path: 020},
	{ binStr: 0, lvl: 2, path: 021},
	{ binStr: 0, lvl: 2, path: 022},
	{ binStr: 1, lvl: 2, path: 023},
	{ binStr: 1, lvl: 2, path: 030},
	{ binStr: 0, lvl: 2, path: 031},
	{ binStr: 1, lvl: 2, path: 032},
	{ binStr: 1, lvl: 2, path: 033}
	]
*/
function quadtree(img, map, sRow, sCol, path, lvl, numOfCols) {

	var isSame = 1;
	var startColor = img[sRow][sCol];
	var binStr = "";
	for(var i = sRow; i < numOfCols; i++) {
		for(var j = sCol; j < numOfCols; j++) {
			var cellColor = img[i][j];
			binStr += cellColor;
			if(startColor != cellColor) {
				isSame = false;
			}
		}
	}

	if(isSame) {
		var elCount = map.length;
		map[elCount] = 
		{
			binStr : binStr,
			path : path,
			lvl : lvl,
			checkedNodes : []
		}; 
		return;
	} else {
		var halfCols = numOfCols / 2;
		quadtree(img, map, 0, 0, path + "0", lvl++, halfCols);
		quadtree(img, map, 0, halfCols - 1, path + "1", lvl++, halfCols);
		quadtree(img, map, halfCols - 1, 0, path + "2", lvl++, halfCols);
		quadtree(img, map, halfCols - 1, halfCols - 1, path + "3", lvl++, halfCols);
	
	}
}

/*

Finds the next power of 2 of a given integer. If the integer is already a power of 2,
it simply returns the integer.

@param num - the number
*/
function powerOf2(num ) {
	var i = 0;
	var base = 2;
	while(true) {
		var power = 2 + i;
		curr = pow(base, power);
		if(num <= curr) {
			return curr;
		}
		i++;
	}
}

/*

Compresses the quadtree by removing duplicate elements.

It does so by comparing the binary strings of each object
on the same lvl for strings whose length is greater than 1.

If the strings match, the object (arbitrarily selected) whose
path is furthest left is removed along with all its sub quadrants 
who have the same path prefix. 

I.e

map before compression:
	[
	{ binStr: 1001001000100011, lvl: 0, path: 0},
	{ binStr: 1001, lvl: 1, path: 00},
	{ binStr: 1111, lvl: 1, path: 01},
	{ binStr: 1001, lvl: 1, path: 02},
	{ binStr: 1011, lvl: 1, path: 03},
	{ binStr: 1, lvl: 2, path: 000},
	{ binStr: 0, lvl: 2, path: 001},
	{ binStr: 0, lvl: 2, path: 002},
	{ binStr: 1, lvl: 2, path: 003},
	{ binStr: 1, lvl: 2, path: 020},
	{ binStr: 0, lvl: 2, path: 021},
	{ binStr: 0, lvl: 2, path: 022},
	{ binStr: 1, lvl: 2, path: 023},
	{ binStr: 1, lvl: 2, path: 030},
	{ binStr: 0, lvl: 2, path: 031},
	{ binStr: 1, lvl: 2, path: 032},
	{ binStr: 1, lvl: 2, path: 033}
	]

map after compression:
	[
	{ binStr: 1001001000100011, lvl: 0, path: 0},
	{ binStr: 1001, lvl: 1, path: 00},
	{ binStr: 1111, lvl: 1, path: 01},
	{ binStr: 1011, lvl: 1, path: 03},
	{ binStr: 1, lvl: 2, path: 000},
	{ binStr: 0, lvl: 2, path: 001},
	{ binStr: 0, lvl: 2, path: 002},
	{ binStr: 1, lvl: 2, path: 003},
	{ binStr: 1, lvl: 2, path: 030},
	{ binStr: 0, lvl: 2, path: 031},
	{ binStr: 1, lvl: 2, path: 032},
	{ binStr: 1, lvl: 2, path: 033}
	]

*/


function compress(map) {

	var pathsToRemove = [];

		for(var i = 0; i < map.length -1 ; i++) {

			var el = map[i];

			var len = el.path.length;

			var ignore = false;

			for(var obj : pathsToRemove) {

				if(obj.path.substring(0,len).contains(el.path)) {
					ignore = true;
				}
			}

			if(ignore || len == 1) {
				continue;
			}

			var els = map.filter(function(obj) {

				return obj.lvl == el.lvl && !(Object.is(obj, el)) && !(el.checkedNodes.contains(obj));

			});

			for (var j = 0 ; j < els.length; j++) {

				if(el.binStr.localCompare(els[j].binStr)) {
					pathsToRemove.push(els[j].path);
				}

				el.checkedNodes.push(els[j]);
				els[j].checkedNodes.push(el);

			}
		}
	}

}




function quicksort(map) {

	//given an array of objects

	//sort on binStr


	var pivot = Math.random() * map.length;







}






main("4 4\n1011\n0111\n1010\n0111\n6 7\n1110111\n1010101\n0000000\n0100010\n1011101\n1010101\n0 0");

