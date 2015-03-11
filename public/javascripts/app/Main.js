/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	/**
	 * This is the main application entry point.
	 * Main is instantiated by the index.html and it's init function called when the web application dependencies are fully loaded.
	 * No other entry points should be used by the index.html
	 *
	 * @class Main
	 * @constructor
	 */
	var Main = function() {};
	var p = Main.prototype;
	p.constructor = Main;

	/**
	 * Stores a reference to G.Game, Everything a King Kong game needs is created by the game.
	 * @property game
	 * @type {G.Game}
	 */
	p.game = null;

	/**
	 * Application entry point initialises Game.
	 * Creates a new Game and calls game.init.
	 *
	 * @method init
	 */
	p.init = function() {
		this.game = new G.Game();
		this.game.init();
	};

	G.Main = Main;

})();