// Displays the tiles in the interactive board.

/*jslint browser: true, maxlen: 80 */

/*global define */

define([
    "tiles", "board", "rubber_band_canvas", "rot_anim_canvas", "arrow_canvas",
    "display_c_sys", "display_canvas_factory", "rotation_factory",
    "rect_t_factory"
], function (tiles, board, rubberBandCanvas, rotAnimCanvas, arrowCanvas,
        displayCSys, displayCanvasFactory, rotationFactory, rectTFactory) {
    "use strict";

    var sideLen;
    var needsToBeRendered = true;
    var selectedRectT; // when dragged: currently selected rectangle
    var draggedToTheRight; // when dragged: current drag direction
    var animIsRunning;
    var rotation;
    var initRotAnimHasToBeTriggered = true;
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

    var animIsRunningNeedsUpdate = function () {
        return (animIsRunning === undefined ||
                animIsRunning !== rotAnimCanvas.animIsRunning);
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

    var overlapForFixedTile = function (posT) {
        var xT = posT[0];
        var yT = posT[1];
        var key = rotAnimCanvas.animIsRunning ? "wasFixed" : "isFixed";
        var overlapX = (xT > 0 && tiles[xT - 1][yT][key])
                ? 1
                : 0;
        var overlapY = (yT > 0 && tiles[xT][yT - 1][key])
                ? 1
                : 0;
        return [overlapX, overlapY];
    };

    var renderTile = function (ctx, posT) {
        var xT = posT[0];
        var yT = posT[1];
        var key = rotAnimCanvas.animIsRunning ? "wasFixed" : "isFixed";
        var tile = tiles[xT][yT];
        var displayAsFixed = tile[key];
        var pos = displayCSys.posFromPosT(posT, displayAsFixed);
        var color = tiles[xT][yT].color;
        var tileSideLen = displayAsFixed
                ? displayCSys.fixedTileSideLen
                : displayCSys.tileSideLen;

        if (tileIsInRotationAnim(posT)) {
            return; // don't show this tile, it's animated
        }

        // overlap to avoid ugly thin black lines when there is no spacing:
        var overlap = displayAsFixed ? overlapForFixedTile(posT) : [0, 0];

        ctx.globalAlpha = tileIsSelected(posT) && selectionCanBeRotated()
            ? 0.5
            : 1;
        ctx.fillStyle = color;
        ctx.fillRect(
            pos[0] - overlap[0],
            pos[1] - overlap[1],
            tileSideLen + overlap[0],
            tileSideLen + overlap[1]
        );
    };

    var renderColumn = function (sideLenT, ctx, xT) {
        var yT = 0;
        while (yT < sideLenT) {
            renderTile(ctx, [xT, yT]);
            yT += 1;
        }
    };

    var render = function () {
        var sideLenT = board.sideLenT;
        var ctx = el.getContext("2d");
        var renderAsFinished = board.isFinished &&
                !rotAnimCanvas.animIsRunning;

        el.height = sideLen;
        el.width = el.height;

        if (renderAsFinished) {
            displayCSys.disableSpacing();
        }

        var xT = 0;
        while (xT < sideLenT) {
            renderColumn(sideLenT, ctx, xT);
            xT += 1;
        }

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
    var triggerInitRotAnim = function () {
        var initRotation = rotationFactory.create(
            rectTFactory.create([0, 0], [tiles.widthT - 1, tiles.heightT - 1]),
            true
        );
        rotAnimCanvas.startAnim(initRotation);
    };

    var tilesCanvas = displayCanvasFactory.create();

    var obtainSideLen = function () {
        if (sideLen !== el.clientWidth && tilesCanvas.isVisible) {
            needsToBeRendered = true;
        }
        sideLen = el.clientWidth;
    };

    var lastRotationHasBeenProcessed = function () {
        return processedNumberOfRotation !== board.numberOfRotation;
    };

    rubberBandCanvas.onDrag = onRubberBandDrag;
    rubberBandCanvas.onDragEnd = onRubberBandDragEnd;

    needsToBeRendered = true;

    return Object.create(tilesCanvas, {
        animStep: {value: function () {
            obtainSideLen();
            updateRubberBandCanvasVisibility(); // TODO: move to rubberbandcanvas?

            if (lastRotationHasBeenProcessed()) {
                startRotationAnim();
                needsToBeRendered = true;
                processedNumberOfRotation = board.numberOfRotation;
            }

            if (initRotAnimHasToBeTriggered) {
                triggerInitRotAnim();
                initRotAnimHasToBeTriggered = false;
            }

            if (animIsRunningNeedsUpdate()) {
                needsToBeRendered = true;
                animIsRunning = rotAnimCanvas.animIsRunning;
            }

            if (needsToBeRendered) {
                render();
                needsToBeRendered = false;
            }
        }}
    });
});
