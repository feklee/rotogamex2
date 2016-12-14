// The game.

/*jslint browser: true, maxlen: 80 */

/*global define, window */

define([
    "display", "boards", "util", "player_constructor", "vendor/rAF"
], function (display, boards, util, playerConstructor) {
    "use strict";

    var loaded = false;

    var animStep;
    animStep = function () {
        display.animStep();

        window.requestAnimationFrame(animStep);
    };

    var adjustFontSize = function () {
        var width = document.getElementById("game").clientWidth; // px
        var size = Math.round(width / 16); // px
        document.getElementsByTagName("body")[0].style.fontSize = size + "px";
    };

    window.addEventListener("resize", adjustFontSize);

    var hideLoadScreen = function () {
        document.getElementById("load-screen").style.display = "none";
    };

    // Needed e.g. on iOS 6 to prevent default dragging of page.
    var preventPageDrag = function () {
        var preventDefault = function (e) {
            e.preventDefault();
        };

        document.addEventListener("touchmove", preventDefault);

        // Don't prevent default on `touchstart`. See also:
        // <http://stackoverflow.com/a/13720649>
    };

    var onDocumentComplete = function () {
        loaded = true;

        playerConstructor(1);
        playerConstructor(2);

        adjustFontSize();

        hideLoadScreen();

        display.isVisible = true;

        animStep(); // Refreshes display right away (to avoid flicker), then
                    // continues with animation
    };

    var onBoardsLoaded = function () {
        util.onceDocumentIsComplete(onDocumentComplete);
    };

    util.immediatelyRefreshAppCache();

    util.onceDocumentIsInteractive(function () {
        preventPageDrag();
        boards.load(onBoardsLoaded);
    });
});
