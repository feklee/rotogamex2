/*jslint browser: true, maxlen: 80 */

/*global define */

define(function () {
    "use strict";

    return function (spec) {
        var score = 0;
        var onIncreaseScore = function () {};
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
            makeActive: {value: function () {
                isActive = true;
                onActivityChanged();
            }},
            isActive: {get: function () {
                return isActive;
            }},
            onActivityChanged: {set: function (x) {
                console.log("fixmeset");
                onActivityChanged = x;
            }}
        });
    };
});
