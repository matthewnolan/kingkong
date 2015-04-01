/*! kingkong 0.0.6 - 2015-02-09
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Central Hub for providing Signals for the app to dispatch and listen to.
	 * Signal Dispatcher is the core communication component of the application.  Ensure it is passed into any Class which might need to talk to another.
	 * In this context we can listen to gameData signals, and have the signalDispatcher dispatch a signal which can be listened to by GameComponents which require
	 * to be notified when some server data has been received.  Eg. ReelsComponent can spin the reels when a spin response is received.
	 * @class SignalDispatcher
	 * @constructor
	 */
	var SignalDispatcher = function() {};
	var p = SignalDispatcher.prototype;
	p.constructor = SignalDispatcher;

	/**
	 * The application config file (setup.json)
	 *
	 * @property setup
	 * @type {Object}
	 * @default null
	 */
	p.setup = null;

	/**
	 * Signal dispatched by the GaffeMenu when a gaffe is selected.
	 *
	 * @property gaffeSelect
	 * @type {Signal}
	 */
	p.gaffeSelect = new signals.Signal();

	/**
	 * Signal dispatched by the ReelsComponent when all reel animations have stopped
	 *
	 * @property reelSpinComplete
	 * @type {Signal}
	 */
	p.reelSpinCompleted = new signals.Signal();

	/**
	 * Signal dispatched by the ReelsComponent when the reel animations have just started.
	 *
	 * @property reelSpinStart
	 * @type {Signal}
	 */
	p.reelSpinStart = new signals.Signal();

	/**
	 * Signal dispatched by the GaffeMenu when FPS switch is used.
	 *
	 * @property fpsSwitched
	 * @type {Signal}
	 */
	p.fpsSwitched = new signals.Signal();

	/**
	 * Signal dispatched when F key is pressed to fire a firework particle for profiling app performance.
	 *
	 * @property fireworkLaunched
	 * @type {Signal}
	 */
	p.fireworkLaunched = new signals.Signal();

	/**
	 * Signal dispatched to update the balance
	 *
	 * @property balanceChanged
	 * @type {Signal}
	 */
	p.balanceChanged = new signals.Signal();

	/**
	 * dispatch this signal to play a sound.
	 *
	 * @property playSound
	 * @type {Signal}
	 */
	p.playSound = new signals.Signal();

	/**
	 * dispatch this signal to stop a sound.
	 *
	 * @property stopSound
	 * @type {Signal}
	 */
	p.stopSound = new signals.Signal();

	/**
	 * Dispatch this signal to start a request for a spinResponse from the server.
	 *
	 * @property serverSpinRequested
	 * @type {Signal}
	 */
	p.spinRequested = new signals.Signal();

	/**
	 * Signal dispatched by GameData Object when server response received
	 *
	 * @property spinReponseReceived
	 * @type {Signal}
	 */
	p.spinResponseReceived = new signals.Signal();

	/**
	 *
	 * @property gaffeSpinRequested
	 * @type {Signal}
	 */
	p.gaffeSpinRequested = new signals.Signal();

	/**
	 * Initialise the SignalDispatcher with setup object and gameComponents.
	 * Initialise signal handlers
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {G.CommandQueue} commandQueue
	 */
	p.init = function(setup, commandQueue) {
		this.setup = setup;
		this.commandQueue = commandQueue;
		this.reelSpinStart.add(this.handleReelSpinStart, this);
		this.spinResponseReceived.add(this.handleServerReelSpinStart, this);
		this.gaffeSelect.add(this.handleGaffeSelected, this);
	};

	/**
	 * Dispatched when GameData has received slotResponse. Get the ReelsComponent and spin call a reelSpin.
	 *
	 * @param spinResponse
	 */
	p.handleServerReelSpinStart = function(spinResponse) {
		var reels = G.Utils.getGameComponentByClass(G.ReelsComponent);
		reels.serverSpinStart(spinResponse);
	};

	/**
	 * Dispached by ReelsComponent when the reel spin begins.
	 * This class calls the components which require to update the display at the start of each spin, eg, clearing win animations queue and graphics.
	 *
	 * @method handleReelSpinStart
	 */
	p.handleReelSpinStart = function() {
		var winLinesComponent = G.Utils.getGameComponentByClass(G.WinLinesComponent);
		var bigWinComponent = G.Utils.getGameComponentByClass(G.BigWinComponent);
		var symbolWinsComponent = G.Utils.getGameComponentByClass(G.SymbolWinsComponent);
		var particles = G.Utils.getGameComponentByClass(G.ParticlesComponent);
		this.commandQueue.flushQueue();
		winLinesComponent.hideWinLines();
		bigWinComponent.hideAnimation();
		symbolWinsComponent.hideAll();
		particles.smokeOff();
		this.commandQueue.setupQueue();
	};

	/**
	 * Dispatched by the GaffeMenu when a gaffe button is selected.
	 * Sets the commandQueue gaffe type for animating the final win, and starts spinning the reels.
	 *
	 * @method handleGaffeSelected
	 * @param {String} gaffeType - the menu option string
	 * @todo clean up gaffing / commandQueue mess
	 */
	p.handleGaffeSelected = function(gaffeType) {
		console.log('handleGaffeSelected', gaffeType);

		var reelsComponent = G.Utils.getGameComponentByClass(G.ReelsComponent);
		if (gaffeType.indexOf("gaffe") >= 0) {
			console.log("gaffe:", gaffeType);
			var playMode = _.find(this.setup.gaffeMenu, function(playMode) {
				return playMode.type === gaffeType;
			});
			this.gaffeSpinRequested.dispatch( playMode.link );
		} else if (gaffeType.indexOf("client") >= 0) {
			this.commandQueue.gaffeType = gaffeType;
			//this.commandQueue.setupQueue();
			reelsComponent.spinReels();
		}








	};



	G.SignalDispatcher = SignalDispatcher;

})();