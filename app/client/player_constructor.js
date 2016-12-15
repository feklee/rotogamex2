/*jslint browser: true, maxlen: 80 */

/*global define */

define(function () { // TODO: ["board"], function (board) {
    "use strict";

    var directions = [-1, 1];

    return function (spec) {
        var score = 0;
        var onScoreIncreased = function () {};

        return Object.create(null, {
            increaseScore: {value: function () {
                score += 1;
                onScoreIncreased();
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
            onScoreIncreased: {set: function (x) {
                onScoreIncreased = x;
            }},
            score: {get: function () {
                return score;
            }}
        });
    };
});
