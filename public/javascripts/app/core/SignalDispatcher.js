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
	 * @deprecated
	 * @property gameComponents
	 * @type {G.GameComponent[]}
	 * @default null
	 */
	p.gameComponents = null;

	/**
	 * The application config file (setup.json)
	 *
	 * @property setup
	 * @type {Object}
	 * @default null
	 */
	p.setup = null;

	/**
	 * Signal dispatched by the GaffMenu when a gaff is selected.
	 *
	 * @property gaffSelect
	 * @type {Signal}
	 */
	p.gaffSelect = new signals.Signal();

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
	 * Signal dispatched by the GaffMenu when FPS switch is used.
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
	 * @property gaffSpinRequested
	 * @type {Signal}
	 */
	p.gaffSpinRequested = new signals.Signal();

	/**
	 * Initialise the SignalDispatcher with setup object and gameComponents.
	 * Initialise signal handlers
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {G.CommandQueue} commandQueue
	 * @param {G.GameComponent[]} gameComponents
	 */
	p.init = function(setup, commandQueue, gameComponents) {
		this.setup = setup;
		this.gameComponents = gameComponents;
		this.commandQueue = commandQueue;
		this.reelSpinStart.add(this.handleReelSpinStart, this);
		this.spinResponseReceived.add(this.handleServerReelSpinStart, this);
		this.gaffSelect.add(this.handleGaffSelected, this);
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
	 * Dispatched by the GaffMenu when a gaff button is selected.
	 * Sets the commandQueue gaff type for animating the final win, and starts spinning the reels.
	 *
	 * @method handleGaffSelected
	 * @param {String} gaffType - the menu option string
	 * @todo change playModesNew name in setup (this is a temporary name)
	 * @todo clean up gaffing
	 */
	p.handleGaffSelected = function(gaffType) {
		console.log('handleGaffSelected', gaffType);

		if (gaffType.indexOf("gaff") >= 0) {
			console.log("gaff:", gaffType);
			var playMode = _.find(this.setup.playModesNew, function(playMode) {
				return playMode.type === gaffType;
			});
			this.gaffSpinRequested.dispatch( playMode.link );
			return;
		}

		this.commandQueue.gaffType = gaffType;
		var reelsComponent = _.find(this.gameComponents, function(component) {
			return component instanceof G.ReelsComponent;
		});


		reelsComponent.spinReels();
	};



	G.SignalDispatcher = SignalDispatcher;

})();