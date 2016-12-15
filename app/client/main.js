// The game.

/*jslint browser: true, maxlen: 80 */

/*global define, window */

define([
    "display", "util", "players", "toolbar_constructor", "board", "vendor/rAF"
], function (display, util, players, toolbarConstructor, board) {
    "use strict";

    var animStep;
    animStep = function () {
        display.animStep();

        window.requestAnimationFrame(animStep);
    };

    var adjustFontSize = function () {
        var width = document.getElementById("game").clientWidth;
        var size = Math.round(width / 16);
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

    var toolbars = [];
    toolbars.push(toolbarConstructor(players[0]));
    toolbars.push(toolbarConstructor(players[1]));
    board.onReset = function () {
        toolbars.forEach(function (toolbar) {
            toolbar.onReset();
        });
    };

    var onDocumentComplete = function () {
        adjustFontSize();

        hideLoadScreen();

        display.isVisible = true;

        animStep(); // Refreshes display right away (to avoid flicker), then
                    // continues with animation
    };

    util.immediatelyRefreshAppCache();

    util.onceDocumentIsInteractive(function () {
        preventPageDrag();
        util.onceDocumentIsComplete(onDocumentComplete);
    });
});
