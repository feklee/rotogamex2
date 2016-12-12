/*jslint browser: true, maxlen: 80 */

/*global define, require, module */

if (typeof define !== "function") {
    var define = require("amdefine")(module);
}

define({
    boards: [ // shown in the specified order, from left to right
        {
            name: "chess",
            sideLenT: 8,
            startPosT: [0, 23],
            endPosT: [8, 23],
            start: "02-01",
            duration: 330
        }
    ]
});
