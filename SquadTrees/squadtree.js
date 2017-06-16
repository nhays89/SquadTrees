/*
input:

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
	}
};


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
			lvl : lvl
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

@param arr - the number
@param comparator - the function to compare objects against
*/
function powerOf2(arr, ) {
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

main("4 4\n1011\n0111\n1010\n0111\n6 7\n1110111\n1010101\n0000000\n0100010\n1011101\n1010101\n0 0");

