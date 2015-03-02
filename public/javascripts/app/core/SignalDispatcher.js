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
	 * @property gaffSelect
	 * @type {Signal}
	 */
	p.gaffSelect = new signals.Signal();

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
	 * @property fpsSwitched
	 * @type {Signal}
	 */
	p.fpsSwitched = new signals.Signal();

	/**
	 *
	 * @type {Signal}
	 */
	p.fireworkLaunched = new signals.Signal();

	/**
	 * dispatch this signal with the new balance.
	 *
	 * @property balanceChanged
	 * @type {Signal}
	 */
	p.balanceChanged = new signals.Signal();

	/**
	 * dispatch this signal for sound.
	 *
	 * @property alterSound
	 * @type {Signal}
	 */
	p.playSound = new signals.Signal();

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
		this.gaffSelect.add(this.handleGaffSelected, this);
		//this.fpsSwitched.add(this.handleFpsSwitch, this);
	};

	/**
	 * @method handleReelSpinStart
	 */
	p.handleReelSpinStart = function() {
		var winLinesComponent = G.Utils.getGameComponentByClass(G.WinLinesComponent);
		var bigWinComponent = G.Utils.getGameComponentByClass(G.BigWinComponent);
		var symbolWinsComponent = G.Utils.getGameComponentByClass(G.SymbolWinsComponent);
		var particles = G.Utils.getGameComponentByClass(G.ParticlesComponent);
		var meter = G.Utils.getGameComponentByClass(G.MeterComponent);
		// var dj = G.Utils.getGameComponentByClass(G.Dj);

		this.commandQueue.flushQueue();
		winLinesComponent.hideWinLines();
		bigWinComponent.hideAnimation();
		symbolWinsComponent.hideAll();
		particles.smokeOff();
		this.commandQueue.setupQueue();

		//todo replace mock functions during server integration
		meter.mockSpinPayment();
	};




	/**
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