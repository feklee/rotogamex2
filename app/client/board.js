// Describes the current state of the boards.

/*jslint browser: true, maxlen: 80 */

/*global define */

define(["tiles"], function (tiles) {
    "use strict";

    var isFinished = false; // true when a game is finished
    var lastRotation = null;
    var numberOfRotation = 0;

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
            numberOfRotation += 1;
        }},

        numberOfRotation: {get: function () {
            return numberOfRotation;
        }},

        tiles: {get: function () {
            return tiles;
        }},

        sideLenT: {get: function () {
            return tiles.length;
        }},

        reset: {value: function () {
            tiles.reset();
            lastRotation = null;
            isFinished = false;
            numberOfRotation = 0;
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
