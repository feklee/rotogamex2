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

    // Updates components for layout.
    var updateComponentsLayout = function (width, height) {
        var remainingHeight = height - width; // height without board display
        var componentHeight;
        var componentTop;
        var horizontalMargin = 0.01 * width;

        componentTop = 0;
        componentHeight = Math.round(remainingHeight * 0.2);
        componentTop += componentHeight;
        componentHeight = width;
        display.layout = {
            sideLen: componentHeight,
            top: componentTop
        };
        componentTop += componentHeight + remainingHeight * 0.03;
        componentHeight = Math.round(remainingHeight * 0.33);
        componentTop += componentHeight + remainingHeight * 0.05;
        componentHeight = Math.round(remainingHeight * 0.39);
    };

    // Gives the game layout. The game is sized so that it takes up maximum
    // space in the browser window. It's aspect ratio is set in limits: between
    // 3:4 and reciprocal golden ratio.
    var updateLayout = function () {
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;
        var viewportRatio = viewportWidth / viewportHeight;
        var s = document.body.style;

        width = viewportWidth;
        height = viewportHeight;

        // restricts aspect ratio:
        if (viewportRatio < 1 / goldenRatio) {
            // thinner than reciprocal golden ratio => restrict height
            height = Math.round(width * goldenRatio);
        } else if (viewportRatio > 3 / 4) {
            // wider than 3:4 => restrict width
            width = Math.round(height * 3 / 4);
        }

        s.width = width + "px";
        s.height = height + "px";
        s.margin = "0 auto"; // centers horizontally

        if (loaded) {
            updateComponentsLayout(width, height);
        }
    };

    var animStep;
    animStep = function () {
        display.animStep();

        window.requestAnimationFrame(animStep);
    };

    var onResize = function () {
        updateLayout();
    };

    var hideLoadScreen = function () {
        document.getElementById("loadScreen").style.display = "none";
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
        var el = document.querySelector("button.reset");
        el.addEventListener("click", onResetClick);
    };

    var onDocumentComplete = function () {
        loaded = true;

        setUpResetButton();

        hideLoadScreen();

        // Resize not beforen now, to avoid jumpy load screen animation.
        onResize(); // captures initial size
        window.addEventListener("resize", onResize);

        display.isVisible = true;
        updateLayout();

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
