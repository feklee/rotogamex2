// Displays the tiles in the interactive board.

/*jslint browser: true, maxlen: 80 */

/*global define */

define([
    "tiles", "board", "rubber_band_canvas", "rot_anim_canvas", "arrow_canvas",
    "display_c_sys", "display_canvas_factory", "rotation_factory",
    "rect_t_factory", "players"
], function (tiles, board, rubberBandCanvas, rotAnimCanvas, arrowCanvas,
        displayCSys, displayCanvasFactory, rotationFactory, rectTFactory,
        players) {
    "use strict";

    var sideLen;
    var needsToBeRendered = true;
    var selectedRectT; // when dragged: currently selected rectangle
    var draggedToTheRight; // when dragged: current drag direction
    var lastAnimIsRunning;
    var rotation;
    var initialRotAnimHasToBeTriggered = true;
    var el = document.querySelector("canvas.tiles");
    var processedNumberOfRotation = 0;

    var updateRotation = function () {
        if (selectedRectT === undefined) {
            rotation = undefined;
        } else {
            rotation = rotationFactory.create(
                selectedRectT,
                draggedToTheRight
            );
        }
    };

    var rotAnimStartedOrStopped = function () {
        return (lastAnimIsRunning === undefined ||
                lastAnimIsRunning !== rotAnimCanvas.animIsRunning);
    };

    var onRubberBandDrag = function (newSelectedRectT, newDraggedToTheRight) {
        if (selectedRectT === undefined ||
                !newSelectedRectT.isEqualTo(selectedRectT) ||
                newDraggedToTheRight !== draggedToTheRight) {
            selectedRectT = newSelectedRectT;
            draggedToTheRight = newDraggedToTheRight;
            needsToBeRendered = true;
            updateRotation();
            if (selectionCanBeRotated()) {
                arrowCanvas.show();
                arrowCanvas.rotation = rotation;
            } else {
                arrowCanvas.hide();
            }
        }
    };

    var updateRubberBandCanvasVisibility = function () {
        if (board.isFinished) {
            rubberBandCanvas.hide();
        } else {
            rubberBandCanvas.show(); // necessary e.g. after undoing finished
        }
    };

    var rowContainsFixedTile = function (leftXT, rightXT, yT) {
        if (leftXT > rightXT) {
            return false;
        }

        return tiles[leftXT][yT].isFixed ||
            rowContainsFixedTile(leftXT + 1, rightXT, yT);
    };

    var selectionCanBeRotated = function () {
        var leftXT = selectedRectT[0][0];
        var topYT = selectedRectT[0][1];
        var rightXT = selectedRectT[1][0];
        var bottomYT = selectedRectT[1][1];

        return !rowContainsFixedTile(leftXT, rightXT, topYT) &&
            !rowContainsFixedTile(leftXT, rightXT, bottomYT);
    };

    var onRubberBandDragEnd = function () {
        if (rotation !== undefined &&
                selectionCanBeRotated() &&
                rotation.makesSense &&
                !board.isFinished) {
            board.rotate(rotation);
        }

        updateRubberBandCanvasVisibility();

        arrowCanvas.hide();

        selectedRectT = undefined;
        updateRotation();

        needsToBeRendered = true;
    };

    var tileIsSelected = function (posT) {
        return (rubberBandCanvas.isBeingDragged &&
                selectedRectT !== undefined &&
                posT[0] >= selectedRectT[0][0] &&
                posT[0] <= selectedRectT[1][0] &&
                posT[1] >= selectedRectT[0][1] &&
                posT[1] <= selectedRectT[1][1]);
    };

    var tileIsInRotationAnim = function (posT) {
        return rotAnimCanvas.animIsRunning && rotAnimCanvas.isInRotRect(posT);
    };

    // gaps may still occur, possibly due to a bug:
    // <http://stackoverflow.com/questions/41163227/cannot-draw-on-part-of-
    // canvas/41164642#41164642>
    var roundBordersBetweenFixedTiles = function (tile, extents) {
        var key = rotAnimCanvas.animIsRunning ? "wasFixed" : "isFixed";
        var xT = tile.posT[0];
        var yT = tile.posT[1];

        if (yT === 0 || tiles[xT][yT - 1][key]) {
            extents.top = Math.round(extents.top);
        }

        if (xT === 0 || tiles[xT - 1][yT][key]) {
            extents.left = Math.round(extents.left);
        }

        if (yT + 1 === board.sideLenT || tiles[xT][yT + 1][key]) {
            extents.bottom = Math.round(extents.bottom);
        }

        if (xT + 1 === board.sideLenT || tiles[xT + 1][yT][key]) {
            extents.right = Math.round(extents.right);
        }
    };

    var renderTile = function (ctx, tile) {
        var posT = tile.posT;
        var key = rotAnimCanvas.animIsRunning ? "wasFixed" : "isFixed";
        var displayAsFixed = tile[key];
        var pos = displayCSys.posFromPosT(posT, displayAsFixed);
        var color = tile.color;
        var tileSideLen = displayAsFixed
                ? displayCSys.fixedTileSideLen
                : displayCSys.tileSideLen;
        var extents = {
            top: pos[1],
            left: pos[0],
            bottom: pos[1] + tileSideLen,
            right: pos[0] + tileSideLen
        };

        if (tileIsInRotationAnim(posT)) {
            return; // don't show this tile, it's animated
        }

        // to avoid ugly thin black lines when there is no spacing:
        if (displayAsFixed) {
            roundBordersBetweenFixedTiles(tile, extents);
        }

        ctx.globalAlpha = tileIsSelected(posT) && selectionCanBeRotated()
            ? 0.5
            : 1;
        ctx.fillStyle = color;
        ctx.fillRect(
            extents.left,
            extents.top,
            extents.right - extents.left,
            extents.bottom - extents.top
        );
    };

    var renderColumn = function (ctx, column) {
        column.forEach(function (tile) {
            renderTile(ctx, tile);
        });
    };

    var render = function () {
        var ctx = el.getContext("2d");
        var renderAsFinished = board.isFinished &&
                !rotAnimCanvas.animIsRunning;

        el.height = el.clientWidth;
        el.width = el.clientHeight;

        if (renderAsFinished) {
            displayCSys.disableSpacing();
        }

        tiles.forEach(function (column) {
            renderColumn(ctx, column);
        });

        if (renderAsFinished) {
            displayCSys.enableSpacing();
        }
    };

    var startRotationAnim = function () {
        var lastRotation = board.lastRotation;
        if (lastRotation !== null) {
            rotAnimCanvas.startAnim(lastRotation);
        }
    };

    // Triggers a rotation animation that is shown when the canvas is first
    // displayed. This rotation serves as a hint concerning how the game works.
    var triggerInitialRotAnim = function () { // TODO: doesn't show
        var initialRotation = rotationFactory.create(
            rectTFactory.create([0, 0], [tiles.widthT - 1, tiles.heightT - 1]),
            true
        );
        rotAnimCanvas.startAnim(initialRotation);
    };

    var tilesCanvas = displayCanvasFactory.create();

    var obtainSideLen = function () {
        if (sideLen !== el.clientWidth && tilesCanvas.isVisible) {
            needsToBeRendered = true;
        }
        sideLen = el.clientWidth;
    };

    var lastRotationHasBeenProcessed = function () {
        return processedNumberOfRotation === board.numberOfRotation;
    };

    rubberBandCanvas.onDrag = onRubberBandDrag;
    rubberBandCanvas.onDragEnd = onRubberBandDragEnd;

    needsToBeRendered = true;

    rotAnimCanvas.onAnimFinished = function () {
        var gameIsFinished = false;

        players.forEach(function (player) {
            if (tiles.allAreFixed(player)) {
                player.increaseScore();
                gameIsFinished = true;
            }
        });

        if (gameIsFinished) {
            tiles.markAllAsFixed();
        }
    };

    return Object.create(tilesCanvas, {
        animStep: {value: function () {
            obtainSideLen();
            updateRubberBandCanvasVisibility();

            if (!lastRotationHasBeenProcessed()) {
                startRotationAnim();
                needsToBeRendered = true;
                processedNumberOfRotation = board.numberOfRotation;
            }

            if (initialRotAnimHasToBeTriggered) {
                triggerInitialRotAnim();
                initialRotAnimHasToBeTriggered = false;
            }

            if (rotAnimStartedOrStopped()) {
                needsToBeRendered = true;
                lastAnimIsRunning = rotAnimCanvas.animIsRunning;
            }

            if (needsToBeRendered) {
                render();
                needsToBeRendered = false;
            }
        }},

        requestRender: {value: function () {
            needsToBeRendered = true;
        }}
    });
});
