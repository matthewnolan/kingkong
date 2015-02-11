/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Constructs queues for the CommandQueue for the purpose of displaying winning animations
	 * @class QueueFactory
	 * @constructor
	 */
	var QueueFactory = function() {};
	var p = QueueFactory.prototype;
	p.constructor = QueueFactory;


	/**
	 * Saves reference to Setup and GameComponents
	 * @method init
	 * @param {Object} setup
	 * @param {G.GameComponent[]} gameComponents
	 */
	p.init = function(setup, gameComponents) {
		this.setup = setup;
		this.gameComponents = gameComponents;
	};






	G.QueueFactory = QueueFactory;

})();