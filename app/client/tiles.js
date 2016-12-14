// Creates tiles objects describing the status of a board.

/*jslint browser: true, maxlen: 80 */

/*global define, require, module */

if (typeof define !== "function") {
    var define = require("amdefine")(module);
}

define(function () {
    "use strict";

    var columnsAreEqual = function (tiles1Column, tiles2Column, isEqual) {
        var yT = 0;
        while (yT < tiles2Column.length) {
            if (!isEqual(tiles2Column[yT], tiles1Column[yT])) {
                return false;
            }
            yT += 1;
        }
        return true;
    };

    var areEqual = function (tiles1, tiles2, isEqual) {
        if (tiles2.widthT !== tiles1.widthT ||
                tiles2.heightT !== tiles1.heightT) {
            return false;
        }

        var xT = 0;
        while (xT < tiles2.length) {
            if (!columnsAreEqual(tiles1[xT], tiles2[xT], isEqual)) {
                return false;
            }
            xT += 1;
        }

        return true;
    };

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
        while (yT <= y2T) {
            tiles[xT][yT] = rotator(sTiles, xT - x1T, yT - y1T, dimensions);
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

    // Rotates the tiles in the specified rectangle in the specified direction:
    // clockwise if `cw` is true
    //
    // The rectangle is defined by its top left and its bottom right corner, in
    // that order.
    var rotate = function (tiles, rotation) {
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
    };

    // Returns the specified triple as RGB string.
    var rgb = function (imgData, offs) {
        return ("rgb(" +
                imgData[offs] + "," +
                imgData[offs + 1] + "," +
                imgData[offs + 2] + ")");
    };

    var createColumnFromCtx = function (xT, rawDataColumn) {
        var tilesColumn = [];
        var offs;
        var yT = 0;
        while (yT < 8) {
            offs = 4 * (yT * 8 + xT);
            tilesColumn.push({
                color: rawDataColumn[yT].color
            });
            yT += 1;
        }
        return tilesColumn;
    };

    // Tile colors are stored in objects and not directly as value of a tile.
    // This makes it possible to differentiate between tiles that have the same
    // color (when comparing them using e.g. `===`).
    var init = function () {
        var rawData = [
                [{"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"},
                 {"color":"rgb(0,0,0)"}],
                [{"color":"rgb(0,0,0)"},
                 {"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"}],
                [{"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"},
                 {"color":"rgb(0,0,0)"}],
                [{"color":"rgb(0,0,0)"},
                 {"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"}],
                [{"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"},
                 {"color":"rgb(0,0,0)"}],
                [{"color":"rgb(0,0,0)"},
                 {"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"}],
                [{"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"},
                 {"color":"rgb(0,0,0)"}],
                [{"color":"rgb(0,0,0)"},
                 {"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(0,127,255)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"},
                 {"color":"rgb(0,0,0)"},
                 {"color":"rgb(255,127,0)"}]];
        var xT = 0;

        tiles.length = 0;
        while (xT < 8) {
            tiles.push(createColumnFromCtx(xT, rawData[xT]));
            xT += 1;
        }
    };

    var tiles = Object.create([], {
        widthT: {get: function () {
            return tiles.length;
        }},

        heightT: {get: function () {
            return tiles.widthT > 0
                ? tiles[0].length
                : 0;
        }},

        rotate: {value: function (rotation) {
            rotate(tiles, rotation);
        }},

        rotateInverse: {value: function (rotation) {
            rotateInverse(tiles, rotation);
        }},

        reset: {value: init}
    });

    init();

    return tiles;
});
