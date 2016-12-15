// Creates tiles objects describing the status of a board.

/*jslint browser: true, maxlen: 80 */

/*global define, require, module */

if (typeof define !== "function") {
    var define = require("amdefine")(module);
}

define(["players"], function (players) {
    "use strict";

    var sideLenT = 8;

    var selectedTilesInColumn = function (tiles, xT, y1T, y2T) {
        var sTilesColumn = [];
        var yT = y1T;
        while (yT <= y2T) {
            sTilesColumn.push(tiles[xT][yT]);
            yT += 1;
        }
        return sTilesColumn;
    };

    var selectedTiles = function (tiles, x1T, y1T, x2T, y2T) {
        var sTiles = [];
        var xT = x1T;
        while (xT <= x2T) {
            sTiles.push(selectedTilesInColumn(tiles, xT, y1T, y2T));
            xT += 1;
        }

        return sTiles;
    };

    var rotator90CW = function (sTiles, xT, yT, dimensions) {
        return sTiles[yT][dimensions.widthT - xT];
    };

    var rotator90CCW = function (sTiles, xT, yT, dimensions) {
        return sTiles[dimensions.heightT - yT][xT];
    };

    var rotator180 = function (sTiles, xT, yT, dimensions) {
        return sTiles[dimensions.widthT - xT][dimensions.heightT - yT];
    };

    var rotateColumnWithRotator = function (xT, tiles, sTiles, x1T, y1T, y2T,
            dimensions, rotator) {
        var yT = y1T;
        while  (yT <= y2T) {
            tiles[xT][yT] = rotator(sTiles, xT - x1T, yT - y1T, dimensions);
            tiles[xT][yT].posT = [xT, yT];
            yT += 1;
        }
    };

    var rotateWithRotator = function (tiles, rectT, rotator) {
        var x1T = rectT[0][0];
        var y1T = rectT[0][1];
        var x2T = rectT[1][0];
        var y2T = rectT[1][1];
        var dimensions = {
            widthT: x2T - x1T,
            heightT: y2T - y1T
        };
        var sTiles = selectedTiles(tiles, x1T, y1T, x2T, y2T);

        var xT = x1T;
        while (xT <= x2T) {
            rotateColumnWithRotator(xT, tiles, sTiles, x1T, y1T, y2T,
                    dimensions, rotator);
            xT += 1;
        }
    };

    var tileSticksToBorderOfPlayer = function (tile, player) {
        if (tile.isFixed) {
            return true;
        }

        if (tile.color !== player.color) {
            return false;
        }

        var xT = tile.posT[0];
        var yT = tile.posT[1];
        var nextYT = yT + player.direction;

        if (nextYT >= sideLenT || nextYT < 0) {
            return true;
        }

        return tileSticksToBorderOfPlayer(tiles[xT][nextYT], player);
    };

    var tileSticksToBorder = function (tile) {
        return tileSticksToBorderOfPlayer(tile, players[0]) ||
            tileSticksToBorderOfPlayer(tile, players[1]);
    };

    var markFixedTilesInColumn = function (column) {
        column.forEach(function (tile) {
            tile.wasFixed = tile.isFixed;
            tile.isFixed = tileSticksToBorder(tile);
        });
    };

    var markFixedTiles = function () {
        tiles.forEach(function (column) {
            markFixedTilesInColumn(column);
        });
    };

    // Rotates the tiles in the specified rectangle in the specified direction:
    // clockwise if `cw` is true
    //
    // The rectangle is defined by its top left and its bottom right corner, in
    // that order.
    var rotate = function (rotation) {
        var rectT = rotation.rectT;
        var cw = rotation.cw;

        if (rectT.isSquare) {
            if (cw) {
                rotateWithRotator(tiles, rectT, rotator90CW);
            } else {
                rotateWithRotator(tiles, rectT, rotator90CCW);
            }
        } else {
            rotateWithRotator(tiles, rectT, rotator180);
        }

        markFixedTiles();
    };

    // Returns the specified triple as RGB string.
    var rgb = function (imgData, offs) {
        return ("rgb(" +
                imgData[offs] + "," +
                imgData[offs + 1] + "," +
                imgData[offs + 2] + ")");
    };

    var initColumnWithChessPattern = function (column, xT) {
        var yT = 0;
        while (yT < sideLenT) {
            var shift = (xT + 1) % 2;
            var shiftedYT = yT + shift;
            var playerNumber = shiftedYT > 3 ? 0 : 1;
            var color = shiftedYT % 2 ? players[playerNumber].color : "black";

            column.push({
                posT: [xT, yT],
                color: color,
                wasFixed: false,
                isFixed: false
            });
            yT += 1;
        }
    };

    var initWithChessPattern = function () {
        var xT = 0;

        tiles.length = 0;
        while (xT < sideLenT) {
            var column = [];
            initColumnWithChessPattern(column, xT);
            tiles.push(column);
            xT += 1;
        }

        markFixedTiles();
    };

    var initWithRandomPattern = function () {
        markFixedTiles();
    };

    var allInColumnAreFixed = function (column, player) {
        return column.every(function (tile) {
            if (tile.color !== player.color) {
                return true;
            }
            return tile.isFixed;
        });
    };

    var allAreFixed = function (player) {
        return tiles.every(function (column) {
            return allInColumnAreFixed(column, player);
        });
    };

    var markAllInColumnAsFixed = function (column) {
        column.forEach(function (tile) {
            tile.isFixed = true;
        });
    };

    var markAllAsFixed = function () {
        tiles.forEach(function (column) {
            markAllInColumnAsFixed(column);
        });
    };

    var tiles = Object.create([], {
        rotate: {value: rotate},
        reset: {value: initWithChessPattern},
        allAreFixed: {value: allAreFixed},
        markAllAsFixed: {value: markAllAsFixed}
    });

    initWithChessPattern();

    return tiles;
});
