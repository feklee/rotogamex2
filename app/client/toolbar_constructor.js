/*jslint browser: true, maxlen: 80 */

/*global define */

define(["boards"], function (boards) {
    "use strict";

    var onResetClick = function () {
        boards.selected.reset();
    };

    var setUpResetButton = function (playerNumber) {
        var el = document.querySelector(".player-" + playerNumber +
                                        ".toolbar .reset button");
        el.addEventListener("click", onResetClick);
    };

    return function (playerNumber) {
        setUpResetButton(playerNumber);
    };
});
