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
	 * Dispatch a signal when graphics caching has completed.
	 * @property cacheCompleted
	 * @type {Signal}
	 */
	p.cacheCompleted = new signals.Signal();

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

	/**
	 * Once a component is initialised correctly, it's display object are ready to be drawn (added) to the stage object
	 * Do this by calling this function.
	 *
	 * @method drawComponent
	 */
	p.drawCompoent = function() {

	};

	/**
	 * Some Vector drawn assets, and Bitmap sprite animations should be played during app initialisation to ensure they are ready to run at runtime.
	 * Call this function once this process is completed, and it will signal to the game that this component's drawing/anim is ready to play.
	 * For Vectors, call this after Vector drawing is done.
	 * For Bitmap sprites, make sure that it's animations have played once then call this.
	 * When adding a component requiring this type of caching, you must add 1 to the Game's initailisedNum.
	 * nb. Caching only takes place when setup.json's failSafeDelay is used.
	 *
	 * @method cacheComplete
	 */
	p.cacheComplete = function() {
		this.cacheCompleted.dispatch();
	};

	G.GameComponent = createjs.promote(GameComponent, "Container");

})();