/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Based on the Command Pattern, a CommandQueue consists of an array of commands (the queue)
	 * And methods to play, pause, loop and flush the current queue.
	 * When set to play, the commandQueue will execute each command in the queue, then wait a period of time defined
	 * in the command, before executing the next command.
	 * Command Queues support infinite looping: when a loopIndex is found inside a command, it will loop back to this command when the queue has finished.
	 *
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
	 * The primary queue which commands must be added to.
	 *
	 * @property queue
	 * @type {G.Command[]}
	 */
	p.queue = [];

	/**
	 * The setTimeout for the queue.
	 *
	 * @property timeout
	 * @type {Number}
	 */
	p.timeout = null;

	/**
	 * This is set to the currentIndex when a loopIndex is found on a command.
	 *
	 * @private
	 * @property loopReturnIndex
	 * @type {number}
	 */
	p.loopReturnIndex = -1;

	/**
	 * Helper class to create prebuilt win animations.
	 *
	 * @property queueFactory
	 * @type {G.QueueFactory}
	 */
	p.queueFactory = null;

	/**
	 * index position of the command to play next in the queue.
	 *
	 * @property currentIndex
	 * @type {number}
	 */
	p.currentIndex = 0;

	/**
	 * If gaffeType is changed to 'client*', then queue may be built from QueueFactory instead of the usual way.
	 * For debugging purposes only
	 *
	 * @property gaffeType
	 * @type {string}
	 */
	p.gaffeType = "default";

	/**
	 * Initialise command queue with setup and a new QueueFactory.
	 *
	 * @method init
	 * @param {Object} setup
	 */
	p.init = function(setup) {
		this.setup = setup;
		this.queueFactory = new G.QueueFactory();
		this.queueFactory.init(setup);
	};

	/**
	 * Initialise a queue ready for playing
	 *
	 * @method setupQueue
	 * @param queue
	 * @todo separate client and server gaffing win queues
	 */
	p.setupQueue = function(queue) {
		console.log('this.setupQueue=', this.gaffeType, queue);
		if (this.gaffeType.indexOf('client') >= 0) {
			this.queue = this.queueFactory.generateGaffe(this.gaffeType);
			return;
		}

		if (queue) {
			this.queue = queue;
		}
	};

	/**
	 *  If there's a queue of commands, then play and reset the gaffeType.
	 *
	 * @method play
	 */
	p.play = function() {
		if (this.queue.length) {
			this.gaffeType = "default";
			this.executeNext();
		}
	};

	/**
	 * executes the currently queued command and schedules a timeout to call the next in queue
	 * or finishes if at the end of the queue, or loops back (loops back to first command in queue with a loopIndex).
	 *
	 * @method executeNext
	 */
	p.executeNext = function() {
		var self = this;
		var command = this.queue[this.currentIndex];
		command.execute();
		if (command.shouldLoop) {
			this.loopReturnIndex = this.currentIndex;
		}

		if (this.currentIndex ++ === this.queue.length - 1)
		{
			if (this.loopReturnIndex >= 0) {
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
		if (this.timeout >= 0) {
			clearTimeout(this.timeout);
		}
	};

	/**
	 * @method resume
	 */
	p.resume = function() {
		console.log('resume timeout=', this.timeout);
		if (this.timeout >= 0) {
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
		this.loopReturnIndex = -1;
		this.timeout = null;
	};

	G.CommandQueue = CommandQueue;

})();