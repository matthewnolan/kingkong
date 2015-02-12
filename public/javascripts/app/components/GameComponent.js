/*! kingkong 0.0.6 - 2015-02-09
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Super class of any game component.  These game components are always initialised with the game's setup file and a signal dispatcher.
	 * This allows all game components (eg. ReelsComponent or WinLinesComponent) to access game setup and dispatch and receive events from other
	 * areas of the application
	 * @class GameComponent
	 * @constructor
	 */
	var GameComponent = function() {
		this.Container_constructor();
	};
	var p = createjs.extend(GameComponent, createjs.Container);
	p.constructor = GameComponent;

	/**
	 * Store for the SignalDispatcher allows us to dispatch and listen to Signals from the rest of the application
	 * @property signalDispatcher
	 * @required
	 * @type {G.SignalDispatcher}
	 */
	p.signalDispatcher = null;

	/**
	 * Store the Setup
	 * @property Setup
	 * @type {null}
	 */
	p.setup = null;

	/**
	 * initialises the setup and signalDispatcher for the component.
	 * @method init
	 * @param {Object} setup
	 * @param {G.SignalDispatcher} signalDispatcher
	 */
	p.init = function(setup, signalDispatcher) {
		this.setup = setup;
		this.signalDispatcher = signalDispatcher;
	};

	G.GameComponent = createjs.promote(GameComponent, "Container");

})();