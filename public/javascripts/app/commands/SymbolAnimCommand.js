/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var SymbolAnimCommand = function() {
		this.Command_constructor();
	};
	var p = createjs.extend(SymbolAnimCommand, G.Command);
	p.constructor = SymbolAnimCommand;

	/**
	 * @property winLineData
	 * @type {Array}
	 */
	p.winLineData = [];

	/**
	 * @property numSquares
	 * @type {number}
	 */
	p.numSquares = 0;

	/**
	 * @property animId - Should match a key from symbol_anims.json['animations']
	 * @type {string}
	 */
	p.animId = "";

	/**
	 * initialise setup, gameComponent and command data
	 * @method init
	 * @param {Object} setup
	 * @param {G.SymbolWinsComponent} gameComponent
	 * @param {Array} winLineIndexes
	 * @param {Number} numSquares
	 * @param {String} animId
	 */
	p.init = function(setup, gameComponent, winLineIndexes, numSquares, animId) {
		this.Command_init(setup, gameComponent);
		this.winLineData = [];
		var i, len = winLineIndexes.length;
		for (i = 0; i < len; i++) {
			this.winLineData.push(this.setup.winLines[winLineIndexes[i]].data);
		}
		this.numSquares = numSquares;
		this.animId = animId;
	};

	/**
	 * Hide Previously drawn anims / winLines and show symbol anims.
	 * @method execute
	 */
	p.execute = function() {
		this.gameComponent.hideAll();
		this.gameComponent.showAnimsOnWinline(this.winLineData, this.numSquares, this.animId);
	};

	G.SymbolAnimCommand = createjs.promote(SymbolAnimCommand, "Command");

})();