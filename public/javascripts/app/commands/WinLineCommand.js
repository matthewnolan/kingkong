/*! kingkong 0.0.6 - 2015-02-10
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var WinLineCommand = function() {
		this.Command_constructor();
	};
	var p = createjs.extend(WinLineCommand, G.Command);
	p.constructor = WinLineCommand;

	/**
	 * this array defines the indexes of winLines to show in this command.  Based on setup.winLines
	 * @property winLineIndexes
	 * @default [0] - show the setup.winLines[0]
	 * @type {number[]}
	 */
	p.winLineIndexes = [0];

	/**
	 * number of squares to display on these winLines
	 * @property numSquares - eg. 4 will display 4 squares and a line over 5 reels
	 * @type {number}
	 */
	p.numSquares = 0;

	/**
	 * If an animation id is defined, then we'll attempt to play a symbol win animation on the correct win square
	 * @property playAnimId
	 * @type {string}
	 */
	p.playAnimId = "";


	/**
	 * @property signalDispatcher
	 * @type {G.SignalDispatcher}
	 */
	p.signalDispatcher = null;
	

	/**
	 * Initialises this command's required data
	 * @method init
	 * @param {Object} setup
	 * @param {G.WinLinesComponent} gameComponent
	 * @param {number[]} winLineIndexes - indexes of winLines based on setup.winLines which we'd like to show
	 * @param {number} numSquares - number of win squares to display on win line
	 * @param {string} playAnimId - play the symbol animation on this square pass "blink" to make a blinking symbol
	 */
	p.init = function(setup, gameComponent, winLineIndexes, numSquares, playAnimId) {
		this.Command_init(setup, gameComponent);
		this.winLineIndexes = winLineIndexes || this.winLineIndexes;
		this.numSquares = numSquares || this.numSquares;
		this.playAnimId = playAnimId || this.playAnimId;
	};

	/**
	 * Hide Previously drawn winLines and show more winLines.
	 * @method execute
	 */
	p.execute = function() {

		var dj = G.Utils.getGameComponentByClass(G.Dj);
		dj.playSound("bonusStop1")

		console.log('show win line command', this.winLineIndexes);

		var symbolWins = G.Utils.getGameComponentByClass(G.SymbolWinsComponent);
		symbolWins.hideAll();

		this.gameComponent.hideWinLines();
		this.gameComponent.showWinLineByIndexes(this.winLineIndexes, this.numSquares);

		var winLineData, i, len = this.winLineIndexes.length;

		if (this.numSquares && this.playAnimId) {
			for (i = 0; i < len; i++) {
				winLineData = this.setup.winLines[this.winLineIndexes[i]].data;
				symbolWins.showAnimsOnWinLine2(winLineData, this.numSquares, this.playAnimId);
			}
		}


	};

	G.WinLineCommand = createjs.promote(WinLineCommand, "Command");

})();