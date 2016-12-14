// The game.

/*jslint browser: true, maxlen: 80 */

/*global define, window */

define([
    "display", "boards", "util", "vendor/rAF"
], function (display, boards, util) {
    "use strict";

    var loaded = false;
    var goldenRatio = 1.61803398875;
    var width; // px
    var height; // px

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

    var onResetClick = function () {
        boards.selected.reset();
    };

    var setUpResetButton = function () {
        var el = document.querySelector(".reset button");
        el.addEventListener("click", onResetClick);
    };

    var onDocumentComplete = function () {
        loaded = true;

        adjustFontSize();

        setUpResetButton();

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
