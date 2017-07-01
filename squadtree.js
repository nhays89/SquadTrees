/* Author: Nicholas A. Hays 

2830 - SquadTrees North America Regionals - East Central
ACM ICPC  

Models an image of black and white pixels using a quad tree. 
Runs a compression algorithm on the tree removing repeated quadrants. 

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

example output:

17 12
61 24

*/


/*

Globals

*/

var map, img;

/*

Runner.
@input - the sample input
i.e "4 4\n1011\n0111\n1010\n0111\n6 7\n1110111\n1010101\n0000000\n0100010\n1011101\n1010101\n0 0"

*/
function main(input) {

    var index;
    var stmts = input.split("\n");
    index = 0;
    var r, c, dims, orig, compressed, tree;
    while (true) {
        map = [];
        img = [];
        dims = stmts[index++].split(" ");
        r = dims[0];
        c = dims[1];
        count = 0;
        if (r == 0 && c == 0) break;
        for (var i = 0; i < r; i++) {
            var row = stmts[index++];
            img[i] = [];
            for (var j = 0; j < c; j++) {
                img[i][j] = row[j];
            }
        }
        pad(img, r, c);
        var path = "0",
            lvl = 0,
            numOfCols = img.length,
            sRow = 0,
            sCol = 0;
        tree = quadtree(img, map, sRow, sCol, path, lvl, parseInt(numOfCols), null);
        orig = tree.siblings + 1;
        compress(tree, [tree]);
        compressed = parseInt(tree.siblings) + 1;
        console.log(orig + " " + compressed);

    }
};

/*

Example quadtree:

1011
0111
1010
0111
Binary String: 
                                      1011011110100111
                                    .     .     .     . 
                                  .      .      .      .   
                                .       .       .       .  
                              .        .        .        .
                            .         .         .         .   
                          .          .          .          .  
                        .           .           .           . 
                      .            .            .            .    
                    .             .             .             .           
                  .              .              .              . 
                .               .               .               . 
              .                .                .                .
            .                 .                 .                 . 
          .                  .                  .                  .
       1001                1111                1001                1011
     . . . .                                  . . . .             . . . . 
    .  .  .  .                              .  .  .  .          .  .  .  .    
   .   .   .   .                          .   .   .   .       .   .   .   .
  .    .    .    .                      .    .    .    .    .    .    .    .
 1     0    0     1                    1     0    0     1  1     0     1    1

Path:

                                                0
                                              ....
                                            . . . . 
                                          .  .  .  . 
                                        .   .   .   . 
                                      .    .    .    .
                                    .     .     .     . 
                                  .      .      .      .   
                                .       .       .       .  
                              .        .        .        .
                            .         .         .         .   
                          .          .          .          .  
                        .           .           .           . 
                      .            .            .            .    
                    .             .             .             .           
                  .              .              .              . 
                .               .               .               . 
              .                .                .                .
            .                 .                 .                 . 
          .                  .                  .                  .
        .                   .                   .                   .    
       00                  01                  02                   03
      ....                                    ....                 ....
     . . . .                                 . . . .              . . . . 
    .  .  .  .                              .  .  .  .           .  .  .  .    
   .   .   .   .                           .   .   .   .        .   .   .   .
  .    .    .    .                        .    .    .    .     .    .    .    .
000  001  002   003                     020  021  022  023   030  031  032  033

*/

function quadtree(img, sRow, sCol, path, lvl, numOfCols, parent) {

    var isSame = true;
    var startColor = img[sRow][sCol];
    var binStr = "";
    var rows = sRow + numOfCols;
    var cols = sCol + numOfCols;
    for (var i = sRow; i < rows; i++) {
        for (var j = sCol; j < cols; j++) {

            var cellColor = img[i][j];
            binStr += cellColor;
            if (startColor != cellColor) {
                isSame = false;
            }
        }
    }

    if (isSame) {
        addSiblings(parent);
        return {
            binStr: binStr,
            path: path,
            lvl: lvl,
            children: [],
            parent: parent,
            siblings: 0
        };

    } else {
        var child = {
            binStr: binStr,
            path: path,
            lvl: lvl,
            children: [],
            parent: parent,
            siblings: 0
        };
        addSiblings(parent);
        var halfCols = Math.floor(numOfCols / 2);
        lvl++;
        child.children.push(quadtree(img, sRow, sCol, path + "0", lvl, halfCols, child));
        child.children.push(quadtree(img, sRow, halfCols, path + "1", lvl, halfCols, child));
        child.children.push(quadtree(img, sRow + halfCols, sCol, path + "2", lvl, halfCols, child));
        child.children.push(quadtree(img, sRow + halfCols, sRow + halfCols, path + "3", lvl, halfCols, child));
        return child;
    }
}

/*

Increases parents siblings by 1 for each new child added. 

*/
function addSiblings(parent) {
    while (parent != null) {
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

Pads zeros around the image right and bottom if the rows and/or columns are not powers of 2. 
111   1110
111 = 1110 
111   1110
      0000

@img - the pixel img
@origRows - the original number of rows of the img
@origCols - the original columns of the img

*/

function pad(img, origRows, origCols) {

    var rows = powerOf2(origRows);
    var cols = powerOf2(origCols);
    if (rows > cols) {
        cols = rows;
    } else {
        rows = cols;
    }
    var rowDiff = rows - origRows;
    var colDiff = cols - origCols;

    for (var i = 0; i < rows; i++) {
        if (i == origRows) {
            origCols = 0;
        }
        for (var j = origCols; j < cols; j++) {
            if (j == 0) {
                img[i] = [];
            }
            img[i][j] = '0';
        }
    }
}

/*

Compresses the quadtree by removing duplicate quadrants.

It does so by comparing the binary strings of each quadrant
with all other quadrants on the same lvl where the quadrant binary
string length is greater than 1.

If the quadrant's binary strings match, the quadrant (arbitrarily selected) whose
path is furthest right is removed (along with all its sub quadrants). 

I.e

tree before compression:

                                      1011011110100111
                                    .     .     .     . 
                                  .      .      .      .   
                                .       .       .       .  
                              .        .        .        .
                            .         .         .         .   
                          .          .          .          .  
                        .           .           .           . 
                      .            .            .            .    
                    .             .             .             .           
                  .              .              .              . 
                .               .               .               . 
              .                .                .                .
            .                 .                 .                 . 
          .                  .                  .                  .
       1001                1111                1001                1011
     . . . .                                  . . . .             . . . . 
    .  .  .  .                              .  .  .  .          .  .  .  .    
   .   .   .   .                          .   .   .   .       .   .   .   .
  .    .    .    .                      .    .    .    .    .    .    .    .
 1     0    0     1                    1     0    0     1  1     0     1    1

tree after compression:

                                      1011011110100111
                                    .     .     .     . 
                                  .      .      .      .   
                                .       .      .        .  
                              .        .     .           .
                            .         .   .               .   
                          .          . .                   .  
                        .          ..                       . 
                      .         .  .                         .    
                    .        .    .                           .           
                  .       .      .                             . 
                .      .        .                               . 
              .     .          .                                 .
            .    .            .                                   . 
          .   .              .                                     .
       1001                1111                                    1011
     . . . .                                                      . . . . 
    .  .  .  .                                                  .  .  .  .    
   .   .   .   .                                              .   .   .   .
  .    .    .    .                                          .    .    .    .
 1     0    0     1                                       1     0     1    1

*/

function compress(root, nodes) {
    if (nodes[0].children.length == 0 || nodes[0].children[0].binStr.length == 1) {
        return;
    }
    var children = [];
    for (var i = 0; i < nodes.length; i++) {
        children = children.concat(nodes[i].children);
    }
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var removeNodes = [];
        for (var j = i + 1; j < children.length; j++) {
            if (child.binStr.localeCompare(children[j].binStr) == 0) {
                removeNodes.push(children[j]);
            }
        }

        for (var k = 0; k < removeNodes.length; k++) {
            var parent = removeNodes[k].parent;
            reduceSiblings(parent, removeNodes[k]);
            var childIndex = parent.children.indexOf(removeNodes[k]);
            parent.children.splice(childIndex, 1);
            children.splice(children.indexOf(removeNodes[k]), 1);
        }

    }
    compress(root, children);
}

/*

Reduces the parents siblings by the sum of the child's siblings and the child.

*/
function reduceSiblings(parent, child) {
    var childSiblings = child.siblings;
    while (parent != null) {
        parent.siblings = parent.siblings - childSiblings - 1;
        parent = parent.parent;
    }
}

main("4 4\n1011\n0111\n1010\n0111\n6 7\n1110111\n1010101\n0000000\n0100010\n1011101\n1010101\n0 0");
