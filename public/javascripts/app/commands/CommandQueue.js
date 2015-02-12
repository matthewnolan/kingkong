/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Schdule and execute Commands in a CommandQueue
	 * @class CommandQueue
	 * @constructor
	 */
	var CommandQueue = function() {};
	var p = CommandQueue.prototype;
	p.constructor = CommandQueue;

	/**
	 * @property setup
	 * @type {Object}
	 */
	p.setup = null;

	/**
	 * @property queue
	 * @type {G.Command[]}
	 */
	p.queue = [];

	/**
	 * @deprecated
	 * @property timeout
	 * @type {Number}
	 */
	p.timeout = null;

	/**
	 * @property shouldLoop
	 * @type {boolean}
	 */
	p.shouldLoop = false;

	/**
	 * @property loopReturnIndex
	 * @type {number}
	 */
	p.loopReturnIndex = 0;

	/**
	 * @property queueFactory
	 * @type {G.QueueFactory}
	 */
	p.queueFactory = null;

	/**
	 * @property currentIndex
	 * @type {number}
	 */
	p.currentIndex = 0;

	/**
	 * @property gameComponents
	 * @type {G.GameComponent[]}
	 */
	p.gameComponents = null;

	/**
	 * Saves reference to Setup and creates a QueueFactory
	 * @method init
	 * @param {Object} setup
	 * @param {G.GameComponent[]} gameComponents
	 */
	p.init = function(setup, gameComponents) {
		this.setup = setup;
		this.gameComponents = gameComponents;
		this.queueFactory = new G.QueueFactory();
		this.queueFactory.init(setup, gameComponents);
	};

	/**
	 * Initialise a queue ready for playing
	 * @method setupQueue
	 * @todo introduce playNow option
	 */
	p.setupQueue = function() {
		createjs.Sound.play("bonusStop1");

		var winLinesComponent =_.find(this.gameComponents, function(component) {
			return component instanceof G.WinLinesComponent;
		});

		var winLineCommand = new G.WinLineCommand();
		winLineCommand.init(this.setup, winLinesComponent, [1,2,3,4,5]);
		this.queue = [winLineCommand];
	};

	/**
	 *  Plays the current queue, defined during setupQueue function.
	 * @method play
	 */
	p.play = function() {
		var len = this.queue.length;

		if (len) {
			this.executeNext();
		}
	};

	/**
	 * executes the currently queued command and schedules a timeout to call the next in queue
	 * or finishes if at the end of the queue, or loops back (loops back to first command in queue with a loopIndex).
	 * @method executeNext
	 */
	p.executeNext = function() {
		var self = this;
		var command = this.queue[this.currentIndex];
		command.execute();
		if (command.loopIndex) {
			this.loopReturnIndex = command.loopIndex;
		}

		if (this.currentIndex ++ === this.queue.length - 1)
		{
			if (this.shouldLoop) {
				this.currentIndex = 0;
			} else {
				this.flushQueue();
				return;
			}
		}

		this.timeout = setTimeout(function() {
			self.executeNext.call(self);
		},  command.callNextDelay);
	};

	/**
	 * @todo implement this
	 * @method stop
	 */
	p.stop = function() {
		throw "not implemented";
	};

	/**
	 * clears any timeouts and prepares class for a new queue.
	 * @method flushQueue
	 */
	p.flushQueue = function() {
		clearTimeout(this.timeout);
		this.currentIndex = 0;
		this.queue = [];
	};

	G.CommandQueue = CommandQueue;

})();