



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

		genQuadTree(img, sRow, sCol, path, lvl, numOfCols);



	}
};


function genQuadTree(img, sRow, sCol, path, lvl, numOfCols) {

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
		quadtree(img, 0, 0, path + "0", lvl++, halfCols);
		quadtree(img, 0, halfCols - 1, path + "1", lvl++, halfCols);
		quadtree(img, halfCols - 1, 0, path + "2", lvl++, halfCols);
		quadtree(img, halfCols - 1, halfCols - 1, path + "3", lvl++, halfCols);
	
	}

	




}


function Node () {
	this.binStr;
}



main("4 4\n1011\n0111\n1010\n0111\n6 7\n1110111\n1010101\n0000000\n0100010\n1011101\n1010101\n0 0");

