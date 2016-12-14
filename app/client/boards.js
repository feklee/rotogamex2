// Describes the current state of the boards.

/*jslint browser: true, maxlen: 80 */

/*global define */

define([
    "tiles_factory", "board_factory", "config"
], function (
    tilesFactory,
    boardFactory,
    config
) {
    "use strict";

    var selectedI = 0;
    var object;

    var createBoards = function () {
        config.boards.forEach(function (boardConfig) {
            var sideLenT = boardConfig.sideLenT;
            var startTiles = tilesFactory.createFromCtx(
                null,
                boardConfig.startPosT,
                sideLenT
            );

            object.push(boardFactory.create(
                boardConfig.name,
                startTiles
            ));
        });
    };

    object = Object.create([], {
        load: {value: function (onLoaded) {
            createBoards();
        }},

        selected: {get: function () {
            return object[selectedI];
        }},

        selectedI: {
            get: function () {
                return selectedI;
            },
            set: function (newSelectedI) {
                selectedI = newSelectedI;
            }
        }
    });

    return object;
});
