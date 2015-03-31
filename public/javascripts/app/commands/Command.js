/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Commands contain the methods init, and execute.
	 * Commands can be added to a CommandQueue once initialised with any necessary data, when added to a CommandQueue, commands' execute
	 * function is called when the command is reached in the queue. The command's callNextDelay defines how many millis until the next
	 * command may be called.
	 *
	 * @class Command
	 * @constructor
	 */
	var Command = function() {};
	var p = Command.prototype;
	p.constructor = Command;

	/**
	 * Set to true to make the Queue loop back to this command when finished
	 *
	 * @property shouldLoop
	 * @default false - No looping
	 * @example: true - Loop back to this command on queue finish.
	 * @type {number}
	 */
	p.shouldLoop = false;

	/**
	 * duration of time in millis to allow this command to execute
	 *
	 * @property callNextDelay
	 * @default 2000
	 * @type {number}
	 */
	p.callNextDelay = 2000;

	/**
	 * Store the setup object
	 *
	 * @property setup
	 * @type {Object}
	 */
	p.setup = null;

	/**
	 * The primary G.GameComponent which this Command should use on.
	 * Other gameComponents may be also called using Utils.getGameComponentByClass if more than one gameComponent needs to be used.
	 *
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
	 */
	p.init = function(setup) {
		this.setup = setup;
	};

	/**
	 * Executes the Command.
	 * Override this method in the particular Command.
	 *
	 * @method execute
	 */
	p.execute = function() {

	};

	G.Command = Command;

})();