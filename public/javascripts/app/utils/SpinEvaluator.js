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
	 * @property slotInitVO
	 * @type {Object}
	 */
	p.slotInitVO = null;

	/**
	 * @property signalDispatcher
	 * @type {G.SignalDispatcher}
	 * @default null
	 */
	p.signalDispatcher = null;

	/**
	 * Used here to prepare and run win animations.
	 *
	 * @property commandQueue
	 * @type {G.CommandQueue}
	 * @default null
	 */
	p.commandQueue = null;

	/**
	 * Initialise Class dependencies
	 * Create signal handlers related to win animation
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {G.SignalDispatcher} signalDispatcher
	 * @param {G.CommandQueue} commandQueue
	 * @param {Object} slotInitVO
	 */
	p.init = function(setup, signalDispatcher, commandQueue, slotInitVO) {
		this.setup = setup;
		this.signalDispatcher = signalDispatcher;
		this.commandQueue = commandQueue;
		this.slotInitVO = slotInitVO;
		this.signalDispatcher.reelSpinComplete.add(this.handleReelSpinComplete, this);
	};

	/**
	 * Dispatched by ReelsComponent when the reel spin stops.
	 * Here we can setup any necessary win animations, and update the meter.
	 *
	 * @method handleReeSpinComplete
	 */
	p.handleReelSpinComplete = function(spinResponse) {
		console.log('handleReelSpinComplete', this.commandQueue.gaffType);

		//allow client side gaffs:
		if (this.commandQueue.gaffType.indexOf('client') >= 0) {
			this.doClientSideGaff();
			return;
		}

		//if spin response is from the server continue..
		var numRecords = spinResponse.spinRecords.length;
		if (numRecords === 1) {
			//1 spin record, proceed
		} else {
			console.warn("multiple spin records is not supported yet");
		}

		var record = spinResponse.spinRecords[0];
		console.log('spin record=', record);

		if (record.wins) {
			this.evaluateWins(record);
		}
	};

	/**
	 * @method doClientSideGaff
	 */
	p.doClientSideGaff = function() {
		this.commandQueue.play();
		this.commandQueue.gaffType = "default";
		var gaffMenu = G.Utils.getGameComponentByClass(G.GaffMenuComponent);
		gaffMenu.deselectGaffButtons();
		var meter = G.Utils.getGameComponentByClass(G.MeterComponent);
		meter.checkMockWin();
	};

	/**
	 * @method evaluateWin
	 */
	p.evaluateWins = function(record) {
		console.warn(">> evaluateWins :: ", record);

		var i, len = record.wins.length, win;
		for (i = 0; i < len; i++) {
			win = record.wins[i];
			console.log('win ' + i + " type:", win.winningType, ": ", win);
		}



		/*

		 */

	};




	G.SpinEvaluator = SpinEvaluator;

})();