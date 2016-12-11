// Displays the tiles in the interactive board.

/*jslint browser: true, maxlen: 80 */

/*global define */

define([
    "boards", "rubber_band_canvas", "rot_anim_canvas", "arrow_canvas",
    "display_c_sys", "display_canvas_factory", "../common/rotation_factory",
    "../common/rect_t_factory"
], function (boards, rubberBandCanvas, rotAnimCanvas, arrowCanvas,
        displayCSys, displayCanvasFactory, rotationFactory, rectTFactory) {
    "use strict";

    var sideLen;
    var tiles;
    var board;
    var needsToBeRendered = true;
    var selectedRectT; // when dragged: currently selected rectangle
    var draggedToTheRight; // when dragged: current drag direction
    var animIsRunning;
    var rotation;
    var initRotAnimHasToBeTriggered = true;

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

    var tilesNeedUpdate = function () {
        return tiles === undefined || !board.tiles.areEqualTo(tiles);
    };

    var animIsRunningNeedsUpdate = function () {
        return (animIsRunning === undefined ||
                animIsRunning !== rotAnimCanvas.animIsRunning);
    };

    var boardNeedsUpdate = function () {
        return board === undefined || board !== boards.selected;
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
        board = boards.selected;
        if (board.isFinished || !board.rotationIsPossible) {
            rubberBandCanvas.hide();
        } else {
            rubberBandCanvas.show(); // necessary e.g. after undoing finished
        }
    };

    var rowContainsFixedTile = function (leftXT, rightXT, yT) {
        if (leftXT > rightXT) {
            return false;
        }

        return tileIsFixed([leftXT, yT]) ||
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
                !boards.selected.isFinished) {
            boards.selected.rotate(rotation);
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

    var tileSticksToBorder = function (xT, yT, color, direction) {
        var tileIsOutsideBoard = yT >= tiles.heightT || yT < 0;

        if (tileIsOutsideBoard) {
            return true;
        }

        return (tiles[xT][yT].color === color) &&
            tileSticksToBorder(xT, yT + direction, color, direction);
    };

    var tileIsFixed = function (posT) {
        var xT = posT[0];
        var yT = posT[1];

        if (yT < 2) {
            return tileSticksToBorder(xT, yT, "rgb(0,255,0)", -1);
        }

        if (yT >= tiles.heightT - 2) {
            return tileSticksToBorder(xT, yT, "rgb(255,0,255)", 1);
        }

        return false;
    };

    var renderTile = function (ctx, posT) {
        var isFixed = tileIsFixed(posT);
        var pos = displayCSys.posFromPosT(posT, isFixed);
        var color = tiles[posT[0]][posT[1]].color;
        var tileSideLen = isFixed
                ? displayCSys.fixedTileSideLen
                : displayCSys.tileSideLen;

        // overlap to avoid ugly thin black lines when there is no spacing:
/* TODO:          if (isFixed) {
            pos[1] += posT[1] < 2 ? -1 : 0;
            tileSideLen += 1;
        }
*/

        if (rotAnimCanvas.animIsRunning && rotAnimCanvas.isInRotRect(posT)) {
            return; // don't show this tile, it's animated
        }

        ctx.globalAlpha = tileIsSelected(posT) && selectionCanBeRotated()
            ? 0.5
            : 1;
        ctx.fillStyle = color;
        ctx.fillRect(
            pos[0],
            pos[1],
            tileSideLen,
            tileSideLen
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
        var el = document.getElementById("tilesCanvas");
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

    var updateTiles = function (boardHasChanged) {
        tiles = board.tiles.copy();

        if (!boardHasChanged) {
            startRotationAnim();
        } // else: change in tiles not due to rotation

        updateRubberBandCanvasVisibility();

        arrowCanvas.hide(); // necessary e.g. after undoing finished
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

    rubberBandCanvas.onDrag = onRubberBandDrag;
    rubberBandCanvas.onDragEnd = onRubberBandDragEnd;

    return Object.create(displayCanvasFactory.create(), {
        animStep: {value: function () {
            var boardHasChanged;

            if (boardNeedsUpdate()) {
                needsToBeRendered = true;
                board = boards.selected;
                boardHasChanged = true;
            } else {
                boardHasChanged = false;
            }

            if (tilesNeedUpdate()) {
                updateTiles(boardHasChanged);
                needsToBeRendered = true;
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
        }},

        sideLen: {set: function (x) {
            if (x !== sideLen) {
                sideLen = x;
                needsToBeRendered = true;
            }
        }}
    });
});
