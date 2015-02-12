/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var BigWinCommand = function() {
		this.Command_constructor();
	};
	var p = createjs.extend(BigWinCommand, G.Command);
	p.constructor = BigWinCommand;


	/**
	 * initialise game data and component
	 * @method init
	 * @param setup
	 * @param gameComponent
	 */
	p.init = function(setup, gameComponent) {
		this.Command_init(setup, gameComponent);

	};

	p.execute = function() {
		this.gameComponent.playAnimation();
	};

	G.BigWinCommand = createjs.promote(BigWinCommand, "Command");

})();