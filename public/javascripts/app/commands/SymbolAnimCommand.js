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
	 * @property paylines
	 * @type {Array}
	 */
	p.paylines = [];

	/**
	 * @property numSquares
	 * @type {number}
	 */
	p.numSquares = 0;

	/**
	 * @property frameLabel - Should match a key from symbol_anims.json['animations']
	 * @type {string}
	 */
	p.frameLabel = "";

	/**
	 * initialise setup, gameComponent and command data
	 * @method init
	 * @param {Object} setup
	 * @param {Array} paylineIndexes - array of paylineIndexes eg [0,1,2]
	 * @param {Number} numSquares
	 * @param {String} frameLabel
	 */
	p.init = function(setup, paylineIndexes, numSquares, frameLabel) {
		this.Command_init(setup);
		this.winLineData = [];
		var i, len = paylineIndexes.length;
		for (i = 0; i < len; i++) {
			this.paylines.push(this.setup.winLines[paylineIndexes[i]].data);
		}
		this.gameComponent = G.Utils.getGameComponentByClass(G.SymbolWinsComponent);
		this.numSquares = numSquares;
		this.frameLabel = frameLabel;
	};

	/**
	 * Hide Previously drawn anims / winLines and show symbol anims.
	 * @method execute
	 */
	p.execute = function() {
		console.log(this.animId);
		// this.gameComponent.hideAll();
		//@todo send the short frameLabel
		var i, len = this.paylines.length;
		for (i = 0; i < len; i++) {
			this.gameComponent.showAnimsOnWinLine(this.paylines[i], this.numSquares, this.frameLabel.toLowerCase());
		}
	};

	G.SymbolAnimCommand = createjs.promote(SymbolAnimCommand, "Command");

})();