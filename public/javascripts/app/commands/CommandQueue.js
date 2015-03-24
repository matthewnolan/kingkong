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
	 * A special win animation is displayed according to setup.gaffs and QueueFactory
	 * @property gaffType
	 * @type {string}
	 * @see G.QueueFactory
	 */
	p.gaffType = "default";

	/**
	 * Saves reference to Setup and creates a QueueFactory
	 * @method init
	 * @param {Object} setup
	 * @param {G.GameComponent[]} gameComponents
	 */
	p.init = function(setup) {
		this.setup = setup;
		this.queueFactory = new G.QueueFactory();
		this.queueFactory.init(setup);
	};

	/**
	 * Initialise a queue ready for playing
	 * @method setupQueue
	 * @todo allow mocked client or server gaffs
	 */
	p.setupQueue = function() {
		console.log('this.setupQueue=', this.gaffType);
		if (this.gaffType.indexOf('client') >= 0) {
			this.queue = this.queueFactory.generateGaff(this.gaffType);
			console.log("this.queue=", this.queue)
		}
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
			this.loopReturnIndex = this.currentIndex;
			this.shouldLoop = true;
		}

		if (this.currentIndex ++ === this.queue.length - 1)
		{
			if (this.shouldLoop) {
				this.currentIndex = this.loopReturnIndex;
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
	 * @method pause
	 */
	p.pause = function() {
		console.log('pause timeout=', this.timeout);
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
	};

	/**
	 * @method resume
	 */
	p.resume = function() {
		console.log('resume timeout=', this.timeout);
		if (this.timeout) {
			this.currentIndex--;
			this.executeNext();
		}
	};

	/**
	 * clears any timeouts and prepares class for a new queue.
	 * @method flushQueue
	 */
	p.flushQueue = function() {
		clearTimeout(this.timeout);
		this.currentIndex = 0;
		this.queue = [];
		this.shouldLoop = false;
		this.timeout = null;
	};

	G.CommandQueue = CommandQueue;

})();