// The game.

/*jslint browser: true, maxlen: 80 */

/*global define, window */

define([
    "display", "util", "players", "new_toolbar", "board",
    "tiles_canvas", "vendor/rAF"
], function (display, util, players, newToolbar, board, tilesCanvas) {
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
    toolbars.push(newToolbar(players[0]));
    toolbars.push(newToolbar(players[1]));
    toolbars[0].otherToolbar = toolbars[1];
    toolbars[1].otherToolbar = toolbars[0];
    board.onReset = function () {
        tilesCanvas.requestRender();
    };

    var onDocumentComplete = function () {
        adjustFontSize();

        hideLoadScreen();

        display.isVisible = true;

        animStep(); // Refreshes display right away (to avoid flicker), then
                    // continues with animation
    };

    util.onceDocumentIsInteractive(function () {
        preventPageDrag();
        util.onceDocumentIsComplete(onDocumentComplete);
    });
});
