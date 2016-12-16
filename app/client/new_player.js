/*jslint browser: true, maxlen: 80 */

/*global define */

define(function () { // TODO: ["board"], function (board) {
    "use strict";

    return function (spec) {
        var score = 0;
        var onIncreaseScore = function () {};
        var isRequestingResetToChess = false;
        var isRequestingResetToRandom = false;
        var onAskForResetToChess = function () {};
        var onAskForResetToRandom = function () {};
        var onActivityChanged = function () {};
        var isActive = false;

        return Object.create(null, {
            increaseScore: {value: function () {
                score += 1;
                onIncreaseScore();
            }},
            color: {get: function () {
                return spec.color;
            }},
            direction: {get: function () {
                return spec.direction;
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
// TODO            isRequestingReset + type?
            isRequestingResetToChess: {get: function () {
                return isRequestingResetToChess;
            }, set: function (x) {
                isRequestingResetToChess = x;
            }},
            isRequestingResetToRandom: {get: function () {
                return isRequestingResetToRandom;
            }, set: function (x) {
                isRequestingResetToRandom = x;
            }},
            makeActive: {value: function () {
                isActive = true;
                onActivityChanged();
            }},
            isActive: {get: function () {
                return isActive;
            }},
            onActivityChanged: {set: function (x) {
                onActivityChanged = x;
            }},
            onAskForResetToChess: {set: function (x) {
                onAskForResetToChess = x;
            }},
            onAskForResetToRandom: {set: function (x) {
                onAskForResetToRandom = x;
            }},
            askForResetToChess: {value: function () {
                onAskForResetToChess();
            }},
            askForResetToRandom: {value: function () {
                onAskForResetToRandom();
            }}
        });
    };
});
