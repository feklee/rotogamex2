// Creates boards.

/*jslint browser: true, maxlen: 80 */

/*global define */

define(function () {
    "use strict";

    // Updates `internal.isFinished`.
    var updateIsFinished = function (internal, board) {
        if (board.tiles.colorsAreEqualTo(board.endTiles)) {
            if (!internal.isFinished) {
                internal.isFinished = true;
            }
            // TODO: also consider draw when finishing
        } else {
            internal.isFinished = false;
        }
    };

    // May also be used to reset.
    var initInternal = function (internal, startTiles) {
        if (startTiles !== undefined) {
            internal.startTiles = startTiles;
        }
        internal.tiles = internal.startTiles.copy();
        internal.isFinished = false; // true when game is finished
    };

    var prototype = Object.create(null, {
        rotate: {value: function (board, internal, rotation) {
            board.tiles.rotate(rotation);
            updateIsFinished(internal, board);
            internal.lastRotation = rotation;
        }},
    });

    var create = function (name, startTiles, endTiles) {
        var internal = {};

        initInternal(internal, startTiles);

        var board = Object.create(prototype);

        return Object.defineProperties(board, {
            rotate: {value: function (rotation) {
                prototype.rotate(board, internal, rotation);
            }},

            tiles: {get: function () {
                return internal.tiles;
            }},

            endTiles: {get: function () {
                return endTiles;
            }},

            sideLenT: {get: function () {
                return internal.tiles.length;
            }},

            reset: {value: function () {
                initInternal(internal);
            }},

            isFinished: {get: function () {
                return internal.isFinished;
            }},

            lastRotation: {get: function () {
                return internal.lastRotation;
            }},

            name: {get: function () {
                return name;
            }},
        });
    };

    return Object.create(null, {
        create: {value: create}
    });
});
