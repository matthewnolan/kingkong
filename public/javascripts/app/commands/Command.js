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
	 * The primary G.GameComponent which this Command should act on.
	 * @property gameComponent
	 * @type {G.GameComponent}
	 */
	p.gameComponent = null;

	/**
	 * Initialise all date required by this Command to execute.
	 * Override this method in the Command, but ensure super.init is called.
	 * The primary game component that this command will call a function on should be passed in as the gameComponent parameter.
	 * Other GameComponents may be used by the Command, but should be accessed by the G.Utils.getComponentByClass method.
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {G.GameComponent} gameComponent
	 */
	p.init = function(setup, gameComponent) {
		this.setup = setup;
		this.gameComponent = gameComponent;
	};

	/**
	 * Executes the Command.
	 * Override this method in the particular Command.
	 * @method execute
	 */
	p.execute = function() {
		if (!this.setup) {
			throw "No setup object found, ensure Command is initialised correctly";
		}
		if (!this.gameComponent) {
			throw "No primary gameComponent found, ensure Command is initialised correctly";
		}
	};

	G.Command = Command;

})();