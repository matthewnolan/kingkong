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

	p.setup = null;
	p.queue = [];
	p.timeout = null;
	p.shouldLoop = false;
	p.loopReturnIndex = 0;
	p.queueFactory = null;
	p.currentIndex = 0;

	p.init = function(setup) {
		this.setup = setup;

		this.queueFactory = new G.QueueFactory();
		this.queueFactory.init();
	};

	p.setupQueue = function() {
		throw "not implemented";
	};

	p.play = function() {

		var len = this.queue.length;

		if (len) {
			this.executeNext(this.queue[this.currentIndex]);
		}

	};

	p.executeNext = function(command) {

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
			}
		}

		this.timeout = setTimeout(this.executeNext, command.callNextDelay);
	};

	p.stop = function() {
		throw "not implemented";
	};

	p.flushQueue = function() {
		this.queue = [];
		window.clearTimeout(this.timeout);
	};

	G.CommandQueue = CommandQueue;

})();