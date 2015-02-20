/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * @class Command
	 * @abstract
	 * @constructor
	 */
	var Command = function() {};
	var p = Command.prototype;
	p.constructor = Command;

	/**
	 * Set to any value other than 0 to make the Queue loop back to this command when finished
	 * @property loopIndex
	 * @default 0 - No looping
	 * @type {number}
	 */
	p.loopIndex = 0;

	/**
	 * duration of time in millis to allow this command to execute
	 * @property callNextDelay
	 * @default 2000
	 * @type {number}
	 */
	p.callNextDelay = 2000;

	/**
	 * @property setup
	 * @type {Object}
	 */
	p.setup = null;

	/**
	 * @property gameComponent
	 * @type {G.GameComponent}
	 */
	p.gameComponent = null;

	/**
	 *
	 * @param {Object} setup
	 * @param {G.GameComponent} gameComponent
	 */
	p.init = function(setup, gameComponent) {
		this.setup = setup;
		this.gameComponent = gameComponent;
	};

	/**
	 * Ususally overridden by a particular game command
	 * @method execute
	 */
	p.execute = function() {
		//console.log("Command execute");
	};

	G.Command = Command;

})();