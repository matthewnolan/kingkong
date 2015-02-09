/*! kingkong 0.0.6 - 2015-02-09
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Central Hub for providing Signals for the app to dispatch and listen to.
	 * @class SignalDispatcher
	 * @constructor
	 */
	var SignalDispatcher = function() {};
	var p = SignalDispatcher.prototype;
	p.constructor = SignalDispatcher;

	/**
	 * @property reelSpinComplete
	 * @type {Signal}
	 */
	p.reelSpinComplete = new signals.Signal();

	/**
	 * @method init
	 */
	p.init = function() {

		this.commandQueue = new G.CommandQueue();
		this.commandQueue.init();

		this.reelSpinComplete.add(this.handleReelSpinComplete, this);
	};

	/**
	 * @method handleReeSpinComplete
	 */
	p.handleReelSpinComplete = function() {

		this.commandQueue.setupQueue();
		this.commandQueue.play();
	};

	G.SignalDispatcher = SignalDispatcher;

})();