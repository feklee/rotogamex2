/*jslint browser: true, maxlen: 80 */

/*global define */

define(["new_player"], function (newPlayer) {
    "use strict";

    var players = [];

    players.push(newPlayer({
        number: 0,
        color: "rgb(0,127,255)"
    }));

    players.push(newPlayer({
        number: 1,
        color: "rgb(255,127,0)"
    }));

    return players;
});
