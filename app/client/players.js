/*jslint browser: true, maxlen: 80 */

/*global define */

define(["new_player"], function (newPlayer) {
    "use strict";

    var players = [];

    players.push(newPlayer({
        number: 0,
        color: "rgb(255,127,0)",
        direction: -1
    }));

    players.push(newPlayer({
        number: 1,
        color: "rgb(0,127,255)",
        direction: 1
    }));

    var activePlayer = players[0];
    var onActivePlayerChange = function () {};

    Object.defineProperties(players, {
        activateOther: {value: function () {
            activePlayer === players[0] ? players[1] : players[0];
            onActivePlayerChange();
        }},

        active: {get: function () {
            return activePlayer;
        }},

        onActivePlayerChange: {set: function (x) {
            onActivePlayerChange = x;
        }}
    });

    return players;
});
