/*jslint browser: true, maxlen: 80 */

/*global define */

define(["player_constructor"], function (playerConstructor) {
    "use strict";

    var players = [];

    players.push(playerConstructor({
        number: 0,
        color: "rgb(255,127,0)"
    }));

    players.push(playerConstructor({
        number: 1,
        color: "rgb(0,127,255)"
    }));

    return players;
});
