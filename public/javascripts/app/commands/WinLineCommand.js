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
	 *
	 * @param {Object} setup
	 * @param {G.WinLinesComponent} gameComponent
	 * @param {Number[]} winLineIndexes - indexes of winLines based on setup.winLines which we'd like to show
	 */
	p.init = function(setup, gameComponent, winLineIndexes) {
		this.Command_init(setup, gameComponent);
		this.winLineIndexes = winLineIndexes || this.winLineIndexes;
	};

	/**
	 * Hide Previously drawn winLines and show more winLines.
	 * @method execute
	 */
	p.execute = function() {
		this.gameComponent.hideWinLines();
		this.gameComponent.showWinLineByIndexes(this.winLineIndexes);
	};

	G.WinLineCommand = createjs.promote(WinLineCommand, "Command");

})();