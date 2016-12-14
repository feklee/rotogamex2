// Describes the current state of the boards.

/*jslint browser: true, maxlen: 80 */

/*global define */

define([
    "tiles_factory"
], function (
    tilesFactory
) {
    "use strict";

    var startTiles = tilesFactory.createFromCtx(null, null, 8);
    var isFinished = false; // true when a game is finished
    var tiles = startTiles.copy();
    var lastRotation = null;

    // Updates `isFinished`.
    var updateIsFinished = function () {
        isFinished = false;

        // TODO: also consider draw when finishing
    };

    return Object.create(null, {
        rotate: {value: function (rotation) {
            tiles.rotate(rotation);
            updateIsFinished();
            lastRotation = rotation;
        }},

        tiles: {get: function () {
            return tiles;
        }},

        sideLenT: {get: function () {
            return tiles.length;
        }},

        reset: {value: function () {
            tiles = startTiles.copy();
            lastRotation = null;
            isFinished = false;
        }},

        isFinished: {get: function () {
            return isFinished;
        }},

        lastRotation: {get: function () {
            return lastRotation;
        }},

        name: {get: function () {
            return name;
        }},
    });
});
