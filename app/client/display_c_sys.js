// Functionality for the coordinate system in the display canvases.

/*jslint browser: true, maxlen: 80 */

/*global define */

define(["boards"], function (boards) {
    "use strict";

    var tileSideLen = 0;
    var fixedTileSideLen = 0;
    var spacing = 0;
    var board;
    var sideLen;

    var updateDimensions = function () {
        var sideLenT;

        if (board !== undefined) {
            sideLenT = board.sideLenT;
            spacing = 0.05 * sideLen / sideLenT;
            tileSideLen = (sideLen - spacing * (sideLenT + 1)) / sideLenT;
            fixedTileSideLen = sideLen / sideLenT;
        }
    };

    return Object.create(null, {
        sideLen: {set: function (x) {
            if (x !== sideLen) {
                sideLen = x;
                updateDimensions();
            }
        }},

        animStep: {value: function () {
            if (boards.selected !== board) {
                board = boards.selected;
                updateDimensions();
            }
        }},

        // Converts tile position to screen position.
        posFromPosT: {value: function (posT, tileIsFixed = false) {
            return posT.map(function (coordT) {
                var s = tileIsFixed ? 0 : spacing;
                var l = tileIsFixed ? fixedTileSideLen : tileSideLen;
                return coordT * (l + s) + s;
            });
        }},

        // inverse of `posFromPosT`, with `Math.floor` applied to each element
        posTFromPos: {value: function (pos) {
            return pos.map(function (coord) {
                return (coord - spacing) / (tileSideLen + spacing);
            });
        }},

        // If the specified position is in spacing between tiles, then
        // coordinates in question are shifted so that they are in the middle
        // of the next tile to the upper and/or left.
        decIfInSpacing: {value: function (pos) {
            return pos.map(function (coord) {
                var modulo = coord % (tileSideLen + spacing);
                return (coord > 0 && modulo < spacing)
                    ? (coord - modulo - tileSideLen / 2)
                    : coord;
            });
        }},

        // Like `decIfInSpacing` but shifts to the tile to the lower and/or
        // right.
        incIfInSpacing: {value: function (pos) {
            return pos.map(function (coord) {
                var modulo = coord % (tileSideLen + spacing);
                return (coord > 0 && modulo < spacing)
                    ? (coord - modulo + spacing + tileSideLen / 2)
                    : coord;
            });
        }},

        // Returns posT, if necessary truncates so that it fits into the board.
        posTInBounds: {value: function (posT) {
            return posT.map(function (coordT) {
                return Math.min(Math.max(coordT, 0), board.sideLenT - 1);
            });
        }},

        fixedTileSideLen: {get: function () {
            return fixedTileSideLen;
        }},

        tileSideLen: {get: function () {
            return tileSideLen;
        }},

        disableSpacing: {value: function () {
            spacingIsDisabled = true;
            updateDimensions();
        }},

        enableSpacing: {value: function () {
            spacingIsDisabled = false;
            updateDimensions();
        }}
    });
});
