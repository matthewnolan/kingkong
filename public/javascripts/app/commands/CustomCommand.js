/*! kingkong 0.3.0 - 2015-03-17
 * Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function() {
    "use strict";

	/**
	 * For testing functionality inside a command queue.. put what you want in one of these
	 *
	 * @class CustomCommand
	 * @constructor
	 */
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
        // symbolWinsComponent.playBySpriteByRowCol(1, 0, "F6intro__001");
        // symbolWinsComponent.playBySpriteByRowCol(2, 0, "D2intro__001");
        // symbolWinsComponent.playBySpriteByRowCol(3, 0, "D3intro__001");
        // symbolWinsComponent.playBySpriteByRowCol(4, 0, "D4intro__001");
        // symbolWinsComponent.playBySpriteByRowCol(0, 1, "F5intro__001");
        // symbolWinsComponent.playBySpriteByRowCol(0, 1, "F6intro__001");
        // symbolWinsComponent.playBySpriteByRowCol(1, 1, "M1intro__001");
        // symbolWinsComponent.playBySpriteByRowCol(2, 1, "M2intro__001");
        // symbolWinsComponent.playBySpriteByRowCol(3, 1, "M3intro__001");
        // symbolWinsComponent.playBySpriteByRowCol(4, 1, "M4intro__001");
        // symbolWinsComponent.playBySpriteByRowCol(0, 2, "WWintro__001");
        // symbolWinsComponent.playBySpriteByRowCol(1, 2, "B1Intro__001_short");
        // symbolWinsComponent.playBySpriteByRowCol(2, 2, "WWintro__001_resume");
        // symbolWinsComponent.playBySpriteByRowCol(3, 2, "B2Intro__001_short");
        // symbolWinsComponent.playBySpriteByRowCol(4, 2, "D1intro__001_resume");        
    };

    G.CustomCommand = createjs.promote(CustomCommand, "Command");

})();