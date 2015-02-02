/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var Game = function() {};
	var p = Game.prototype;
	p.constructor = Game;

	p.setup = null;

	p.serverInterface = null;

	p.init = function(serverInterface) {
		this.serverInterface = serverInterface;

	};

	p.setSetup = function(setup) {
		this.setup = setup;

		console.log(this.setup.gameTitle, 'Setup Loaded')
	};

	G.Game = Game;

})();