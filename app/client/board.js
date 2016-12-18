// Describes the current state of the boards.

/*jslint browser: true, maxlen: 80 */

/*global define */

define(["tiles"], function (tiles) {
    "use strict";

    var lastRotation = null;
    var numberOfRotation = 0;
    var sideLenT = tiles.length;
    var onReset = function () {};
    var isFinished = false;

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
            isFinished = false;
            onReset();
        }},

        isFinished: {set: function (x) {
            isFinished = x;
        }, get: function () {
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
