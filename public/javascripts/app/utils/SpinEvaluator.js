/*! kingkong 0.3.1 - 2015-03-23
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * This class is designed to handle spin responses, evaluate any win condition,
	 * and call any win animations necessary.
	 *
	 * @class SpinEvaluator
	 * @constructor
	 */
	var SpinEvaluator = function() {};
	var p = SpinEvaluator.prototype;
	p.constructor = SpinEvaluator;

	/**
	 * @property setup
	 * @type {Object}
	 * @default null
	 */
	p.setup = null;

	/**
	 * @property slotInit
	 * @type {Object}
	 */
	p.slotInit = null;

	/**
	 * @property signalDispatcher
	 * @type {G.SignalDispatcher}
	 * @default null
	 */
	p.signalDispatcher = null;

	/**
	 * Used here to prepare and run win animations.
	 *
	 * @property winAnimationQueue
	 * @type {G.CommandQueue}
	 * @default null
	 */
	p.winAnimationQueue = null;

	/**
	 * Initialise Class dependencies
	 * Create signal handlers related to win animation
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {G.SignalDispatcher} signalDispatcher
	 * @param {G.CommandQueue} commandQueue
	 * @param {Object} slotInit
	 */
	p.init = function(setup, signalDispatcher, commandQueue, slotInit) {
		this.setup = setup;
		this.signalDispatcher = signalDispatcher;
		this.winAnimationQueue = commandQueue;
		this.slotInit = slotInit;

		this.signalDispatcher.reelSpinCompleted.add(this.handleReelSpinComplete, this);
		this.signalDispatcher.spinResponseReceived.add(this.queueWinAnimation, this);
	};

	/**
	 * @method queueWinAnimation
	 */
	p.queueWinAnimation = function(spinResponse) {
		var numRecords = spinResponse.spinRecords.length;
		if (numRecords > 1) {
			console.warn("multiple spin records is not supported yet");
		} else if (!numRecords) {
			throw "no spin record found";
		}

		var record = spinResponse.spinRecords[0];
		if (!record.wins) {
			return;
		}

		console.log('queueWinAnimation=', record);
		var payLineIndex;


		var i, len = record.wins.length, win;
		for (i = 0; i < len; i++) {
			win = record.wins[i];
			console.log('win ' + i + " type:", win.winningType, ": ", win);
			payLineIndex = win.paylineIndex;




		}
	};

	/**
	 * Dispatched by ReelsComponent when the reel spin stops.
	 * Here we can setup any necessary win animations, and update the meter.
	 *
	 * @method handleReeSpinComplete
	 */
	p.handleReelSpinComplete = function() {
		console.log('handleReelSpinComplete', this.winAnimationQueue.gaffType);
		this.winAnimationQueue.play();
		//allow client side gaffs:
		if (this.winAnimationQueue.gaffType.indexOf('client') >= 0) {
			this.doClientSideGaff();
		}
	};

	/**
	 * @method doClientSideGaff
	 */
	p.doClientSideGaff = function() {
		var gaffMenu = G.Utils.getGameComponentByClass(G.GaffMenuComponent);
		gaffMenu.deselectGaffButtons();
		var meter = G.Utils.getGameComponentByClass(G.MeterComponent);
		meter.checkMockWin();
	};



	G.SpinEvaluator = SpinEvaluator;

})();