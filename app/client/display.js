// Shows the interactive board, for playing.

/*jslint browser: true, maxlen: 80 */

/*global define */

define([
    "tiles_canvas", "arrow_canvas", "rubber_band_canvas", "rot_anim_canvas",
    "display_c_sys"
], function (tilesCanvas, arrowCanvas, rubberBandCanvas, rotAnimCanvas,
        displayCSys) {
    "use strict";

    var isVisible = false;

    return Object.create(null, {
        animStep: {value: function () {
            if (isVisible) {
                displayCSys.animStep();
                tilesCanvas.animStep();
                arrowCanvas.animStep();
                rubberBandCanvas.animStep();
                rotAnimCanvas.animStep();
            }
        }},

        isVisible: {set: function () {
            isVisible = true;
        }}
    });
});
