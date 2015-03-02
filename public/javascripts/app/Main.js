/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	/**
	 * The Main Class should give the app its entry point.
	 * The Main Class is instantiated by the Index.html and it's init function called by this in a way that ensures all
	 * dependencies are loaded.
	 * No other entry points should be used by the index.html
	 *
	 * @class Main
	 * @constructor
	 */
	var Main = function() {};
	var p = Main.prototype;
	p.constructor = Main;

	/**
	 * Stores a reference to G.Game, Everything a King Kong game is created by this.
	 * @property game
	 * @type {G.Game}
	 */
	p.game = null;

	/**
	 * Application entry point initialises Game
	 * @method init
	 *
	 */
	p.init = function() {
		this.game = new G.Game();
		this.game.init();
	};

	G.Main = Main;

})();