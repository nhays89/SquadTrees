/*
example input:

4 4
1011
0111
1010
0111
0 0

example output:

17 12

*/
var map, img, count;
function main(input) {

	var index;
	var stmts = input.split("\n");
	index = 0;
	var r, c, dims, orig, compressed, tree;
	while(true) {
		map = [];
		img = [];
		dims = stmts[index++].split(" ");
		r = dims[0];
		c = dims[1];
		count = 0;
		if(r == 0 && c == 0) break;
		for(var i = 0; i < r; i++) {
			var row = stmts[index++];
			img[i] = [];
			for(var j = 0; j < c; j++) {
				img[i][j] = row[j];
			}	
		}
		pad(img, r, c);
		var path = "0", lvl = 0, numOfCols = img.length, sRow = 0, sCol = 0;
		tree = quadtree(img, map, sRow, sCol, path, lvl, parseInt(numOfCols), null);
		orig = tree.siblings + 1;
		compress(tree, [tree]);
		compressed = parseInt(tree.siblings) + 1;
		console.log(orig + " " + compressed);

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

function quadtree(img, map, sRow, sCol, path, lvl, numOfCols, parent) {

	var isSame = true;
	var startColor = img[sRow][sCol];
	var binStr = "";
	var rows = sRow + numOfCols;
	var cols = sCol + numOfCols;
	for(var i = sRow; i < rows; i++) {
		for(var j = sCol; j < cols; j++) {

			var cellColor = img[i][j];
			binStr += cellColor;
			if(startColor != cellColor) {
				isSame = false;
			}
		}
	}

	if(isSame) {
		addSiblings(parent);
		return  {
			binStr : binStr,
			path : path,
			lvl : lvl,
			children : [],
			parent : parent,
			siblings : 0
			};
			
	} else {
		var child = {
			binStr : binStr,
			path : path,
			lvl : lvl,
			children : [],
			parent : parent,
			siblings : 0
		};
while(parent != null) {
			parent.siblings++;
			parent = parent.parent;
		}
		
		var halfCols = Math.floor(numOfCols / 2);
		lvl++;
		child.children.push(quadtree(img, map, sRow, sCol, path + "0", lvl, halfCols, child));
		child.children.push(quadtree(img, map, sRow, halfCols, path + "1", lvl, halfCols, child));
		child.children.push(quadtree(img, map, sRow + halfCols, sCol, path + "2", lvl, halfCols, child));
		child.children.push(quadtree(img, map, sRow + halfCols, sRow + halfCols, path + "3", lvl, halfCols, child));
		return child;
	}
}


function addSiblings(parent) {
	while(parent != null) {
		parent.siblings++;
		parent = parent.parent;
	}
}

/*

Finds the next power of 2 of a given integer.
@param num - the number
*/
function powerOf2(num) {
	return Math.pow(2, Math.ceil(Math.log(num) / Math.log(2)))
}

/*

Pads zeros if the rows and columns are not powers of 2.

 */

 function pad(img, origRows, origCols) {
	
	var rows = powerOf2(origRows);
	var cols = powerOf2(origCols);
	if(rows > cols) {
		cols = rows;
	} else {
		rows = cols;
	}
	var rowDiff = rows - origRows;
	var colDiff = cols - origCols;

	for(var i = 0 ; i < rows; i++) {
		if(i == origRows) {
				origCols = 0;
			} 
		for(var j = origCols; j < cols; j++) {
			
			if(j == 0) {
				img[i] = [];
			}
			img[i][j] = '0';
		}
	}
 }

/*
Compresses the quadtree by removing duplicate elements.

It does so by comparing the binary strings of each object
on the same lvl for strings whose length is greater than 1.

If the strings match, the object (arbitrarily selected) whose
path is furthest right is removed along with all its sub quadrants 
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
/*
function compress(map) {

	var pathsToRemove = [];
	for(var i = 0; i < map.length -1 ; i++) {
		var el = map[i];
		var len = el.path.length;
		var ignore = false;
		for(var obj : pathsToRemove) {

			if(obj.path.substring(0,len) == el.path) {
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
	removeNodes(pathsToRemove, map);
}

function removeNodes(paths, map) {

	for(var path : paths) {
		for(var i = 0 ; i < map.length; i++) {
			if(map[i].path.substring(0, path.length) == path) {
				map.splice(i, 1);
			}
		}
	}
}
*/

function compress(root, nodes) {
	if(nodes[0].children.length == 0 || nodes[0].children[0].binStr.length == 1) {
		return;
	}
	var children = [];
	for(var i = 0 ; i < nodes.length; i++) {
		children = children.concat(nodes[i].children);
	}
	for( var i = 0 ; i < children.length; i++) {
				var child = children[i];
				var removeNodes = [];
			for( var j = i + 1 ; j < children.length; j++) {
				if(child.binStr.localeCompare(children[j].binStr) == 0) {
					removeNodes.push(children[j]);
				}
			}

			for( var k = 0; k < removeNodes.length; k++) {
				var parent = removeNodes[k].parent;
				
				reduceSiblings(parent, removeNodes[k]);
				var childIndex = parent.children.indexOf(removeNodes[k]);
				parent.children.splice(childIndex, 1);
				children.splice(children.indexOf(removeNodes[k]), 1);
			}

	}

	compress(root, children);

}

//removes children nodes from children whoose binStr is the same
function reduceSiblings(parent, child) {
	var childSiblings = child.siblings;
		while(parent != null) {
			parent.siblings = parent.siblings - childSiblings - 1;
			parent = parent.parent;
		}
}

function removeNode(root, path, index) {
	var node = root;

	if(path.length > 0) {
		var char = path.charAt(0);
		path = path.slice(1);
		for(var i = 0; i < root.children.length; i++) {
			if(root.children[i].path.charAt(index).localeCompare(char)) {
				if(path.length == 0) {
					root.children[i] = root.children.splice(i, 1);
				} else {
					removeNode(root.children[i], path, ++index);
				}
				
			}
		}	
	}
}

main("4 4\n1011\n0111\n1010\n0111\n6 7\n1110111\n1010101\n0000000\n0100010\n1011101\n1010101\n0 0");

