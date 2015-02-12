/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * @class BigWinComponent
	 * @extends G.GameComponent
	 * @uses createjs.Container
	 * @constructor
	 */
	var BigWinComponent = function() {
		this.GameComponent_constructor();
	};
	var p = createjs.extend(BigWinComponent, G.GameComponent);
	p.constructor = BigWinComponent;


	/**
	 * Initialise component data
	 * @method init
	 * @param {Object} setup
	 * @param {G.SignalDispatcher} signalDispatcher
	 */
	p.init = function(setup, signalDispatcher) {
		this.GameComponent_init(setup, signalDispatcher);
	};

	p.drawSprites = function() {

	};



	G.BigWinComponent = createjs.promote(BigWinComponent, "GameComponent");

})();