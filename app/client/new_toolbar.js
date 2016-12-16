/*jslint browser: true, maxlen: 80 */

/*global define */

define(["board", "players"], function (board, players) {
    "use strict";

    var resetToChessButtonEl = function (toolbarEl) {
        return toolbarEl.querySelector(".reset button.to-chess");
    };

    var resetToRandomButtonEl = function (toolbarEl) {
        return toolbarEl.querySelector(".reset button.to-random");
    };

    var activityIndicatorEl = function (toolbarEl) {
        return toolbarEl.querySelector(".activity-indicator");
    };

    var onResetToChessClick = function (player) {
        var otherPlayer = players[1 - player.number];
        player.isRequestingResetToChess = true;
        if (otherPlayer.isRequestingResetToChess) {
            board.resetToChess();
            player.isRequestingResetToChess = false;
            otherPlayer.isRequestingResetToChess = false;
        } else {
            otherPlayer.askForResetToChess();
        }
        player.isRequestingResetToRandom = false;
        otherPlayer.isRequestingResetToRandom = false;
    };

    var onResetToRandomClick = function (player) {
        var otherPlayer = players[1 - player.number];
        player.isRequestingResetToRandom = true;
        if (otherPlayer.isRequestingResetToRandom) {
            board.resetToRandom();
            player.isRequestingResetToRandom = false;
            otherPlayer.isRequestingResetToRandom = false;
        } else {
            otherPlayer.askForResetToRandom();
        }
        player.isRequestingResetToChess = false;
        otherPlayer.isRequestingResetToChess = false;
    };

    var setUpResetToChessButton = function (toolbarEl, player) {
        resetToChessButtonEl(toolbarEl).addEventListener("click", function () {
            onResetToChessClick(player);
        });
    };

    var setUpResetToRandomButton = function (toolbarEl, player) {
        resetToRandomButtonEl(toolbarEl).addEventListener("click", function () {
            onResetToRandomClick(player);
        });
    };

    var onActivityChanged = function (toolbarEl, player) {
        if (player.isActive) {
            activityIndicatorEl(toolbarEl).classList.add("highlighted");
        } else {
            activityIndicatorEl(toolbarEl).classList.remove("highlighted");
        }
    };

    var renderScore = function (toolbarEl, player) {
        var el = toolbarEl.querySelector(".score");
        el.innerHTML = player.score;
    };

    var onAskForResetToChess = function (toolbarEl) {
        resetToChessButtonEl(toolbarEl).classList.add("highlighted");
    };

    var onAskForResetToRandom = function (toolbarEl) {
        resetToRandomButtonEl(toolbarEl).classList.add("highlighted");
    };

    var onReset = function (toolbarEl) {
        resetToChessButtonEl(toolbarEl).classList.remove("highlighted");
        resetToRandomButtonEl(toolbarEl).classList.remove("highlighted");
    };

    return function (player) {
        var toolbarEl = document.querySelector(".player-" + player.number +
                                               ".toolbar");

        setUpResetToChessButton(toolbarEl, player);
        setUpResetToRandomButton(toolbarEl, player);
        toolbarEl.style.background = player.color;
        renderScore(toolbarEl, player);
        player.onIncreaseScore = function () {
            renderScore(toolbarEl, player);
        };
        player.onAskForResetToChess = function () {
            onAskForResetToChess(toolbarEl);
        };
        player.onAskForResetToRandom = function () {
            onAskForResetToRandom(toolbarEl);
        };
        player.onActivityChanged = function () {
            onActivityChanged(toolbarEl, player);
        }

        return Object.create(null, {
            onReset: {value: function () {
                onReset(toolbarEl);
            }}
        });
    };
});
