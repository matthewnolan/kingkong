/*! kingkong 0.0.6 - 2015-02-10
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * This command has a dual purpose, so it's important to read the init function arguments correctly.
	 * Firstly, the command can show multiple Winlines (may rename to Payline as that is the name used by server).
	 * In this case, pass an array of all the paylineIndexes to the init function.
	 * Secondly the command can show a single payline, in that case pass an array containing only 1 payline index in the array.
	 *
	 * If only one payline is being shown, we might want to animate some symbols with a square win box around it.
	 * To do this, either pass a frameLabel, or an array of frameLabels for mixed animations
	 *
	 * @class WinLineCommand
	 * @extends G.Command
	 * @constructor
	 */
	var WinLineCommand = function() {
		this.Command_constructor();
	};
	var p = createjs.extend(WinLineCommand, G.Command);
	p.constructor = WinLineCommand;

	/**
	 * this array defines the indexes of paylines to show in this command.  Based on setup.winLines (will rename to paylines as they are named on server)
	 *
	 * @property payLineIndexes
	 * @default [0] - show payline from setup.winLines[0].data
	 * @type {number[]}
	 */
	p.payLineIndexes = [0];

	/**
	 * number of squares to display on these winLines
	 *
	 * @property numSquares - eg. 4 will display 4 squares and a line over 5 reels
	 * @type {number}
	 * @default 0
	 */
	p.numSquares = 0;

	/**
	 * If an animation id is defined, then we'll attempt to play a symbol win animation on the correct win square
	 *
	 * @property frameLabel
	 * @example "m2intro__001" defined by texture packer output
	 * @type {string}
	 */
	p.frameLabel = "";

	/**
	 * If array of frameLabels defined, then play a mixed set of symbol animations.
	 * If the length of this array is greater than numSquares, then the exceeding labels won't play any anim.
	 *
	 * @property frameLabels
	 * @type {string[]}
	 * @example ["m2", "m1", "m3", "m1", "m1"] would play at this paylineindex: m2, m1, m3, m1, m1 symbol animations in that order.
	 */
	p.frameLabels = [];

	/**
	 * pass true as the last argument to the init function to have the SymbolWinsComponent auto append its suffix to the fameLabel.
	 * @todo use this always, and remove the need to change it.
	 * @property autoAppendSuffix
	 * @type {boolean}
	 * @default false
	 */
	p.autoAppendSuffix = false;

	/**
	 * @property signalDispatcher
	 * @type {G.SignalDispatcher}
	 */
	p.signalDispatcher = null;
	

	/**
	 * Initialises this command's required data
	 * @method init
	 * @param {Object} setup
	 * @param {number[]} payLineIndexes - array indexes of winLines based on setup.winLines which we'd like to show
	 * @param {number} numSquares - number of win squares to display on win line (with animation if frameLabel(s) defined)
	 * @param {string} frameLabel - optional - play a symbol animation on this payline
	 * @param {string[]} frameLabels - optional - array of frameLabels, play mixed animations on this payline
	 * index.  This is an array so you can play different symbol animations on one payline.  This currently  will only work if
	 * the paylineIndexes array has length 1.
	 * @param {Boolean} autoAppendSuffix - set to true if you'd like to automatically append the suffix set in SymbolWinsComponent to the frameLabel.
	 * @todo implement blinking symbol animations in instances where framelabel can't be found in the sprite animations
	 */
	p.init = function(setup, payLineIndexes, numSquares, frameLabel, frameLabels, autoAppendSuffix) {
		this.Command_init(setup);
		this.payLineIndexes = payLineIndexes || this.payLineIndexes;
		this.numSquares = numSquares || this.numSquares;
		this.frameLabel = frameLabel || this.frameLabel;
		this.gameComponent = G.Utils.getGameComponentByClass(G.WinLinesComponent);
		if (payLineIndexes.length === 1) {
			this.frameLabels = frameLabels || this.frameLabels;
		}
		this.autoAppendSuffix = autoAppendSuffix || this.autoAppendSuffix;		
	};

	/**
	 * Hide Previously drawn winLines and show more winLines.
	 * optionally play some symbol animations on the payline(s).  If the command was initted with a playAnimId, then play the same animation across the pay line
	 * If the command was initted with frameLabels array, play a mixed set of symbol animations across the pay line.
	 * @method execute
	 * @todo simplify this command by always calling init with framelabels array.
	 * @todo make paylineIndexes array optional (pass a single payline index to show one payline).
	 */
	p.execute = function() {
		var symbolWins = G.Utils.getGameComponentByClass(G.SymbolWinsComponent);
		symbolWins.hideAll();

		this.gameComponent.hideWinLines();
		this.gameComponent.showWinLineByIndexes(this.payLineIndexes, this.numSquares);

		var winLineData, i, len = this.payLineIndexes.length;

		if (this.numSquares && this.frameLabel && !this.frameLabels.length) {
			for (i = 0; i < len; i++) {
				winLineData = this.setup.winLines[this.payLineIndexes[i]].data;
				symbolWins.showAnimsOnWinLine(winLineData, this.numSquares, this.frameLabel.toLowerCase(), this.autoAppendSuffix);
			}
		} else if (this.frameLabels && this.payLineIndexes.length === 1) {
			winLineData = this.setup.winLines[this.payLineIndexes[0]].data;
			symbolWins.playMixedAnims(winLineData, this.numSquares, this.frameLabels, this.autoAppendSuffix);
		}
	};

	G.WinLineCommand = createjs.promote(WinLineCommand, "Command");

})();