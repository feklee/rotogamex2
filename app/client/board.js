// Describes the current state of the boards.

/*jslint browser: true, maxlen: 80 */

/*global define */

define(["tiles"], function (tiles) {
    "use strict";

    var isFinished = false; // true when a game is finished
    var lastRotation = null;
    var numberOfRotation = 0;
    var sideLenT = tiles.length;
    var onReset = function () {};

    return Object.create(null, {
        rotate: {value: function (rotation) {
            tiles.rotate(rotation);
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
            return sideLenT;
        }},

        resetTo: {value: function (type) {
            tiles.resetTo(type);
            lastRotation = null;
            numberOfRotation = 0;
            onReset();
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

        onReset: {set: function (x) {
            onReset = x;
        }}
    });
});
