/*jslint browser: true, maxlen: 80 */

/*global define */

define(["board", "players"], function (board, players) {
    "use strict";

    var onResetClick = function (player) {
        var otherPlayer = players[1 - player.number];
        player.isRequestingReset = true;
        if (otherPlayer.isRequestingReset) {
            board.reset();
            player.isRequestingReset = false;
            otherPlayer.isRequestingReset = false;
        } else {
            otherPlayer.askForReset();
        }
    };

    var setUpResetButton = function (toolbarEl, player) {
        var el = toolbarEl.querySelector(".reset button");
        el.addEventListener("click", function () {
            onResetClick(player);
        });
    };

    var renderScore = function (toolbarEl, player) {
        var el = toolbarEl.querySelector(".score");
        el.innerHTML = player.score;
    };

    var onAskForReset = function (toolbarEl) {
        toolbarEl.querySelector(".reset button").classList.add("highlighted");
    };

    var onReset = function (toolbarEl) {
        toolbarEl.querySelector(".reset button").classList.
            remove("highlighted");
    };

    return function (player) {
        var toolbarEl = document.querySelector(".player-" + player.number +
                                               ".toolbar");

        setUpResetButton(toolbarEl, player);
        toolbarEl.style.background = player.color;
        renderScore(toolbarEl, player);
        player.onIncreaseScore = function () {
            renderScore(toolbarEl, player);
        };
        player.onAskForReset = function () {
            onAskForReset(toolbarEl);
        };
        board.onReset = function () {
            board.onReset();
            onReset(toolbarEl);
        };

        return Object.create(null, {
            onReset: {value: function () {
                onReset(toolbarEl);
            }}
        });
    };
});
