/*jslint browser: true, maxlen: 80 */

/*global define */

define(["board"], function (board) {
    "use strict";

    var onResetClick = function () {
        board.reset();
    };

    var setUpResetButton = function (toolbarEl) {
        var el = toolbarEl.querySelector(".reset button");
        el.addEventListener("click", onResetClick);
    };

    var renderScore = function (toolbarEl, score) {
        var el = toolbarEl.querySelector(".score");
        el.innerHTML = score;
    };

    return function (playerNumber) {
        var score = 0;
        var toolbarEl = document.querySelector(".player-" + playerNumber +
                                               ".toolbar");

        setUpResetButton(toolbarEl);
        renderScore(toolbarEl, score);

        return Object.create(null, {
            increaseScore: {value: function () {
                score += 1;
                renderScore(toolbarEl, score);
            }}
        });
    };
});
