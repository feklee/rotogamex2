/*jslint browser: true, maxlen: 80 */

/*global define */

define(["board", "players"], function (board, players) {
    "use strict";

    var resetToChessButtonEl = function (toolbarEl) {
        return toolbarEl.querySelector(".reset button.to-chess");
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
    };

    var setUpResetToChessButton = function (toolbarEl, player) {
        resetToChessButtonEl(toolbarEl).addEventListener("click", function () {
            onResetToChessClick(player);
        });
    };

    var renderScore = function (toolbarEl, player) {
        var el = toolbarEl.querySelector(".score");
        el.innerHTML = player.score;
    };

    var onAskForResetToChess = function (toolbarEl) {
        resetToChessButtonEl(toolbarEl).classList.add("highlighted");
    };

    var onResetToChess = function (toolbarEl) {
        console.log("reset handle");
        resetToChessButtonEl(toolbarEl).classList.remove("highlighted");
    };

    return function (player) {
        var toolbarEl = document.querySelector(".player-" + player.number +
                                               ".toolbar");

        setUpResetToChessButton(toolbarEl, player);
        toolbarEl.style.background = player.color;
        renderScore(toolbarEl, player);
        player.onIncreaseScore = function () {
            renderScore(toolbarEl, player);
        };
        player.onAskForResetToChess = function () {
            onAskForResetToChess(toolbarEl);
        };
        board.onResetToChess = function () {
            board.onResetToChess();
            onResetToChess(toolbarEl);
        };

        return Object.create(null, {
            onResetToChess: {value: function () {
                onResetToChess(toolbarEl);
            }}
        });
    };
});
