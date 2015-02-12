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
	 * @property gameComponents
	 * @type {G.GameComponent[]}
	 */
	p.gameComponents = null;

	/**
	 * @property setup
	 * @type {Object}
	 */
	p.setup = null;

	/**
	 * @property reelSpinComplete
	 * @type {Signal}
	 */
	p.reelSpinComplete = new signals.Signal();

	/**
	 * @property reelSpinStart
	 * @type {Signal}
	 */
	p.reelSpinStart = new signals.Signal();

	/**
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {G.GameComponent[]} gameComponents
	 */
	p.init = function(setup, gameComponents) {
		this.setup = setup;
		this.gameComponents = gameComponents;
		this.commandQueue = new G.CommandQueue();
		this.commandQueue.init(setup, gameComponents);
		this.reelSpinStart.add(this.handleReelSpinStart, this);
		this.reelSpinComplete.add(this.handleReelSpinComplete, this);
	};

	/**
	 * @method handleReelSpinStart
	 */
	p.handleReelSpinStart = function() {
		var winLinesComponent = _.find(this.gameComponents, function(component) {
			return component instanceof G.WinLinesComponent;
		});

		var bigWinComponent = _.find(this.gameComponents, function(component) {
			return component instanceof G.BigWinComponent;
		});

		this.commandQueue.flushQueue();
		winLinesComponent.hideWinLines();
		bigWinComponent.hideAnimation();
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