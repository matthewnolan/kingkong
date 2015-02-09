/*! kingkong 0.0.6 - 2015-02-09
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

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

	p.init = function(setup, signalDispatcher) {
		this.setup = setup;
		this.signalDispatcher = signalDispatcher;
	};

	G.GameComponent = createjs.promote(GameComponent, "Container");

})();