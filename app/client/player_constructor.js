/*jslint browser: true, maxlen: 80 */

/*global define */

define(function () { // TODO: ["board"], function (board) {
    "use strict";

    var directions = [-1, 1];

    return function (spec) {
        var score = 0;
        var onIncreaseScore = function () {};
        var isRequestingReset = false;
        var onAskForReset = function () {};

        return Object.create(null, {
            increaseScore: {value: function () {
                score += 1;
                onIncreaseScore();
            }},
            color: {get: function () {
                return spec.color;
            }},
            direction: {get: function () {
                return directions[spec.number];
            }},
            number: {get: function () {
                return spec.number;
            }},
            onIncreaseScore: {set: function (x) {
                onIncreaseScore = x;
            }},
            score: {get: function () {
                return score;
            }},
            isRequestingReset: {get: function () {
                return isRequestingReset;
            }, set: function (x) {
                isRequestingReset = x;
            }},
            onAskForReset: {set: function (x) {
                onAskForReset = x;
            }},
            askForReset: {value: function () {
                onAskForReset();
            }}
        });
    };
});
