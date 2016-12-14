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

    var object;

    var createBoards = function () {
        var startTiles = tilesFactory.createFromCtx(null, null, 8);
        object.push(boardFactory.create("", startTiles));
    };

    object = Object.create([], {
        load: {value: function (onLoaded) {
            createBoards();
        }},

        selected: {get: function () {
            return object[0];
        }}
    });

    return object;
});
