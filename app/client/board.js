// Describes the current state of the boards.

/*jslint browser: true, maxlen: 80 */

/*global define */

define(["boards"], function (boards) {
    "use strict";

    boards.load();

    return boards.selected;
});
