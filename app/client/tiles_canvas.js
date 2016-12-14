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

    var overlapForFixedTile = function (tile, xDir, yDir) {
        var xT = tile.posT[0];
        var yT = tile.posT[1];

        if (xT > 0 && yT > 0) {
            var neighboringTile = tiles[xT - xDir][yT - yDir];
            var key = rotAnimCanvas.animIsRunning ? "wasFixed" : "isFixed";
            var displayNeighboringTileAsFixed = neighboringTile[key];

            return (displayNeighboringTileAsFixed &&
                    tile.color === neighboringTile.color)
                    ? 1
                    : 0;
        } else {
            return 0;
        }
    };

    var overlapsForFixedTile = function (tile) {
        return [overlapForFixedTile(tile, 1, 0),
                overlapForFixedTile(tile, 0, 1)]
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

        if (tileIsInRotationAnim(posT)) {
            return; // don't show this tile, it's animated
        }

        // overlap to avoid ugly thin black lines when there is no spacing:
        var overlaps = displayAsFixed ? overlapsForFixedTile(tile) : [0, 0];

        ctx.globalAlpha = tileIsSelected(posT) && selectionCanBeRotated()
            ? 0.5
            : 1;
        ctx.fillStyle = color;
        ctx.fillRect(
            pos[0] - overlaps[0],
            pos[1] - overlaps[1],
            tileSideLen + overlaps[0],
            tileSideLen + overlaps[1]
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

        el.height = sideLen;
        el.width = el.height;

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
