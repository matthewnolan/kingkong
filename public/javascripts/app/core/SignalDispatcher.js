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
	p.reelSpinComplete = new signals.Signal();

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
	 * Dispatch this signal to request a spinResponse from the server.
	 *
	 * @property serverSpinRequested
	 * @type {Signal}
	 */
	p.serverSpinRequested = new signals.Signal();

	/**
	 * Initialise the SignalDispatcher with setup object and gameComponents.
	 * Initialise signal handlers
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
		this.gaffSelect.add(this.handleGaffSelected, this);
	};

	/**
	 * Dispatched when GameData has received slotResponse. Get the ReelsComponent and spin call a reelSpin.
	 *
	 * @param slotInit
	 * @param spinResponse
	 * @todo slotInit response should be passed to Reels once, and then slot init arg will no longer need to be passed each time.
	 */
	p.handleServerReelSpinStart = function(slotInit, spinResponse) {
		console.log('serverReel')

		var reels = G.Utils.getGameComponentByClass(G.ReelsComponent);
		reels.serverSpinStart(slotInit, spinResponse);
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
	 * Dispached by ReelsComponent when the reel spin stops.
	 * Heree we can setup any necessary win animations, and update the meter.
	 *
	 * @method handleReeSpinComplete
	 */
	p.handleReelSpinComplete = function() {
		this.commandQueue.play();
		this.commandQueue.gaffType = "default";
		var gaffMenu = G.Utils.getGameComponentByClass(G.GaffMenuComponent);
		gaffMenu.deselectGaffButtons();

		var meter = G.Utils.getGameComponentByClass(G.MeterComponent);
		meter.checkMockWin();
	};

	/**
	 * Dispatched by the GaffMenu when a gaff button is selected.
	 * Sets the commandQueue gaff type for animating the final win, and starts spinning the reels.
	 *
	 * @method handleGaffSelected
	 * @param {String} gaffType - the menu option string
	 */
	p.handleGaffSelected = function(gaffType) {

		console.log('handleGaffSelected', gaffType);

		this.commandQueue.gaffType = gaffType;

		var reelsComponent = _.find(this.gameComponents, function(component) {
			return component instanceof G.ReelsComponent;
		});

		reelsComponent.spinReels();
	};



	G.SignalDispatcher = SignalDispatcher;

})();