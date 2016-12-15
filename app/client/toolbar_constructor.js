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

    var setUpToolbar = function (toolbarEl, backgroundColor) {
        setUpResetButton(toolbarEl);
        toolbarEl.style.background = backgroundColor;
    };

    return function (player) {
        var toolbarEl = document.querySelector(".player-" + player.number +
                                               ".toolbar");

        setUpToolbar(toolbarEl, player.color);
        renderScore(toolbarEl, player.score);
        player.onScoreIncreased = function () {
            renderScore(toolbarEl, player.score);
        };

        return Object.create(null);
    };
});
