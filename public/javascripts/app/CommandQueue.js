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
	 * Saves reference to Setup and creates a QueueFactory
	 * @method init
	 * @param setup
	 */
	p.init = function(setup) {
		this.setup = setup;
		this.queueFactory = new G.QueueFactory();
		this.queueFactory.init();
	};

	/**
	 * Initialise a queue ready for playing
	 * @method setupQueue
	 * @todo introduce playNow option
	 */
	p.setupQueue = function() {


	};

	p.play = function() {

		var len = this.queue.length;

		if (len) {
			this.executeNext();
		}

	};

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
			self.executeNext.call(self)
		},  command.callNextDelay);

	};


	p.stop = function() {
		throw "not implemented";
	};

	p.flushQueue = function() {
		clearTimeout(this.timeout);
		this.currentIndex = 0;
		this.queue = [];
	};

	G.CommandQueue = CommandQueue;

})();