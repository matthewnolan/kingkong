/*! kingkong 0.3.0 - 2015-03-17
 * Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function() {
    "use strict";

    var CustomCommand = function() {
        this.Command_constructor();
    };
    var p = createjs.extend(CustomCommand, G.Command);
    p.constructor = CustomCommand;


    p.init = function() {

    };

    p.execute = function() {
        var symbolWinsComponent = G.Utils.getGameComponentByClass(G.SymbolWinsComponent);
        symbolWinsComponent.playBySpriteByRowCol(0, 0, "B1Intro__001");
        symbolWinsComponent.playBySpriteByRowCol(1, 0, "F6intro__001");
    };

    G.CustomCommand = createjs.promote(CustomCommand, "Command");

})();