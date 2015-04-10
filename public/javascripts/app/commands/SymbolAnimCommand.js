/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Command responsible for playing Symbol Animations on the SymbolWinsComponent
	 *
	 * @class SymbolAnimCommand
	 * @extends G.Command
	 * @constructor
	 */
	var SymbolAnimCommand = function() {
		this.Command_constructor();
	};
	var p = createjs.extend(SymbolAnimCommand, G.Command);
	p.constructor = SymbolAnimCommand;

	/**
	 *
	 * @property paylines
	 * @type {Array}
	 */
	p.paylines = [];

	/**
	 *
	 * @property numSquares
	 * @type {number}
	 */
	p.numSymbols = null;

	/**
	 *
	 * @property frameLabel - Should match a key from symbol_anims.json['animations']
	 * @type {string}
	 * @default null
	 */
	p.frameLabel = null;

	/**
	 *
	 * @method autoAppend
	 * @type {boolean}
	 * @default false
	 */
	p.autoAppend = false;

	/**
	 *
	 * @method shouldPlayCombinedSprite
	 * @type {boolean}
	 * @default false
	 */
	p.shouldPlayCombinedSprite = false;

	/**
	 * initialise setup, gameComponent and command data
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {Array} paylineIndexes array of paylineIndexes eg [0,1,2]
	 * @param {Number} numSymbols number of symbols to animate from the left
	 * @param {String} frameLabel
	 * @param {boolean} autoAppend
	 * @param {boolean} shouldPlayCombinedSprite
	 */

	p.init = function(setup, paylineIndexes, numSymbols, frameLabel, autoAppend, shouldPlayCombinedSprite) {
		this.Command_init(setup);
		var i, len = paylineIndexes.length;
		for (i = 0; i < len; i++) {
			this.paylines.push(this.setup.winLines[paylineIndexes[i]].data);
		}
		this.numSymbols = numSymbols;
		this.frameLabel = frameLabel;
		this.autoAppend = autoAppend || this.autoAppend;
		this.shouldPlayCombinedSprite = shouldPlayCombinedSprite || this.shouldPlayCombinedSprite;
	};

	/**
	 * Hide Previously drawn anims / winLines and show symbol anims.
	 *
	 * @method execute
	 */
	p.execute = function() {
		var symbolWinsComponent = G.Utils.getGameComponentByClass(G.SymbolWinsComponent);
		var i, len = this.paylines.length;
		for (i = 0; i < len; i++) {
			//this framelabel check is to cover the fact we only have m1 small anims combined with m1 big animation...
			//don't try to recreate this if in the porting
			if (this.shouldPlayCombinedSprite && this.frameLabel === "m1") {

				symbolWinsComponent.playGaffAnimsOnWinLine(this.paylines[i], this.numSymbols, "m1-sprite__000", false);


			} else {
				symbolWinsComponent.showAnimsOnWinLine(this.paylines[i], this.numSymbols, this.frameLabel.toLowerCase(), this.autoAppend);
			}
		}
	};

	G.SymbolAnimCommand = createjs.promote(SymbolAnimCommand, "Command");

})();