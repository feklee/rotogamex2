/*jslint browser: true, maxlen: 80 */

/*global define */

define(function () { // TODO: ["board"], function (board) {
    "use strict";

    var directions = [-1, 1];

    return function (spec) {
        var score = 0;
        var onIncreaseScore = function () {};
        var isRequestingResetToChess = false;
        var onAskForResetToChess = function () {};

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
            isRequestingResetToChess: {get: function () {
                return isRequestingResetToChess;
            }, set: function (x) {
                isRequestingResetToChess = x;
            }},
            onAskForResetToChess: {set: function (x) {
                onAskForResetToChess = x;
            }},
            askForResetToChess: {value: function () {
                onAskForResetToChess();
            }}
        });
    };
});
