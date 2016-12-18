// Functionality for the coordinate system in the display canvases.

/*jslint browser: true, maxlen: 80 */

/*global define */

define(["board"], function (board) {
    "use strict";

    var tileSideLen = 0;
    var fixedTileSideLen = 0;
    var spacing = 0;
    var sideLen;

    var updateDimensions = function () {
        var sideLenT;

        sideLenT = board.sideLenT;
        spacing = 0.1 * sideLen / sideLenT;
        tileSideLen = (sideLen - spacing * sideLenT) / sideLenT;
        fixedTileSideLen = sideLen / sideLenT;
    };

    var coordFromCoordT = function (coordT, tileIsFixed = false) {
        var s = tileIsFixed ? 0 : spacing;
        var l = tileIsFixed ? fixedTileSideLen : tileSideLen;
        return coordT * (l + s) + s / 2;
    };

    // Converts tile position to screen position. Returns the upper left
    // position of a tile in screen coordinates.
    var posFromPosT = function (posT, tileIsFixed = false) {
        return posT.map(function (coordT) {
            return coordFromCoordT(coordT, tileIsFixed);
        });
    };

    var coordTFromCoord = function (coord) {
        return Math.floor((coord - spacing / 2) / (tileSideLen + spacing));
    };

    // inverse of `posFromPosT`, with `Math.floor` applied to each element
    var posTFromPos = function (pos) {
        return pos.map(coordTFromCoord);
    };

    var obtainSideLen = function () {
        sideLen = document.getElementById("display").clientWidth;
        updateDimensions();
    };

    window.addEventListener("resize", obtainSideLen);

    return Object.create(null, {
        animStep: {value: function () {
            if (sideLen === undefined) {
                obtainSideLen();
            }
        }},

        posFromPosT: {value: posFromPosT},

        posTFromPos: {value: posTFromPos},

        // If the specified position is in spacing between tiles, then
        // coordinates in question are shifted so that they are in the tile
        // above and/or to the left.
        decIfInSpacing: {value: function (pos) {
            return pos.map(function (coord, i) {
                var coordT = coordTFromCoord(coord);
                var coordIsInSpacing =
                        coord > coordFromCoordT(coordT - 1) + tileSideLen &&
                        coord < coordFromCoordT(coordT)
                return coordIsInSpacing ? coord - tileSideLen / 2 : coord;
            });
        }},

        // Like `decIfInSpacing` but shifts to the tile below and/or to the
        // right.
        incIfInSpacing: {value: function (pos) {
            return pos.map(function (coord, i) {
                var coordT = coordTFromCoord(coord);
                var coordIsInSpacing =
                        coord > coordFromCoordT(coordT) + tileSideLen &&
                        coord < coordFromCoordT(coordT + 1)
                return coordIsInSpacing ? coord + tileSideLen / 2 : coord;
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
        }}
    });
});
