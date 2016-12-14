// Describes the current state of the boards.

/*jslint browser: true, maxlen: 80 */

/*global define */

define([
    "tiles_factory", "board_factory"
], function (
    tilesFactory,
    boardFactory
) {
    "use strict";

    var startTiles = tilesFactory.createFromCtx(null, null, 8);
    return boardFactory.create("", startTiles);
});
