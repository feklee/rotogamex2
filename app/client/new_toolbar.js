/*jslint browser: true, maxlen: 80 */

/*global define */

define(["board", "players"], function (board, players) {
    "use strict";

    var resetButtonEl = function (internal, type) {
        return internal.toolbarEl.querySelector(".reset button.to-" + type);
    };

    var activityIndicatorEl = function (internal) {
        return internal.toolbarEl.querySelector(".activity-indicator");
    };

    var resetButtonEls = function (internal) {
        return internal.toolbarEl.querySelectorAll(".reset button");
    };

    var clearReset = function (internal) {
        if (internal.selectedResetType !== undefined) {
            delete internal.selectedResetType;
        }
        resetButtonEls(internal).forEach(function (el) {
            el.classList.remove("highlighted");
        });
    };

    var highlightResetButton = function (internal, type) {
        clearReset(internal);
        resetButtonEl(internal, type).classList.add("highlighted");
    };

    var onResetButtonClick = function (internal, type) {
        if (internal.otherToolbar === undefined) {
            return;
        }

        if (internal.selectedResetType === type) {
            console.log("fixme 2: already selected");
            clearReset(internal);
            internal.otherToolbar.clearReset();
            return;
        }

        if (internal.otherToolbar.selectedResetType === type) {
            board.resetTo(type);
            clearReset(internal);
            internal.otherToolbar.clearReset();
            return;
        }

        internal.otherToolbar.highlightResetButton(type);
        internal.selectedResetType = type;
    };

    var setUpResetButton = function (internal, type) {
        resetButtonEl(internal, type).addEventListener(
            "click",
            function () {
                onResetButtonClick(internal, type);
            }
        );
    };

    var onActivityChanged = function (internal) {
        if (internal.player.isActive) {
            activityIndicatorEl(internal).classList.add("highlighted");
        } else {
            activityIndicatorEl(internal).classList.remove("highlighted");
        }
    };

    var renderScore = function (internal) {
        var el = internal.toolbarEl.querySelector(".score");
        el.innerHTML = internal.player.score;
    };

    return function (player) {
        var internal = {
            player: player,
            toolbarEl: document.querySelector(".player-" + player.number +
                                              ".toolbar")
        };
        internal.toolbarEl.style.background = player.color;

        setUpResetButton(internal, "chess");
        setUpResetButton(internal, "random");
        renderScore(internal);
        internal.player.onIncreaseScore = function () {
            renderScore(internal);
        };
        players.onActivePlayerChange = function () {
            console.log("active change");
            clearReset(internal);
            internal.otherToolbar.clearReset();
            onActivityChanged(internal);
        }

        return Object.create(null, {
            otherToolbar: {set: function (x) {
                internal.otherToolbar = x;
            }},
            selectedResetType: {get: function () {
                return internal.selectedResetType;
            }},
            clearReset: {value: function () {
                clearReset(internal);
            }},
            highlightResetButton: {value: function (type) {
                highlightResetButton(internal, type);
            }}
        });
    };
});
