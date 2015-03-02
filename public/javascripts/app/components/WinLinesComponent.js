/*! kingkong 0.0.1 - 2015-02-07
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * GameComponent for drawing Win Lines
	 * @class WinLinesComponent
	 * @extends G.GameComponent
	 * @constructor
	 */
	var WinLinesComponent = function() {
		this.GameComponent_constructor();
	};

	var p = createjs.extend(WinLinesComponent, G.GameComponent);
	p.constructor = WinLinesComponent;

	/**
	 * Stores win lines
	 * @property winLines
	 * @type {G.WinLine[]}
	 */
	p.winLines = [];

	/**
	 * Store number of winLines to compare with drawn Lines and dispatch complete signal when drawn
	 * @property numLinesTotal
	 * @type {number}
	 */
	p.numLinesTotoal = 0;

	/**
	 * Count number of lines drawn to compare with numLinesTotal to dispatch complete signal.
	 * @property numLinesDrawn
	 * @type {number}
	 */
	p.numLinesDrawn = 0;

	/**
	 *
	 * @type {Number}
	 */
	p.loadPercentage = 0;

	/**
	 * Stores passed setup data
	 * @method init
	 * @param {Object} setup
	 * @param {G.SignalDispatcher} signalDispatcher
	 */
	p.init = function(setup, signalDispatcher) {
		this.GameComponent_init(setup, signalDispatcher);
	};

	/**
	 * draws winLines to stage in an invisible state ready for displaying later
	 * @method drawComponent
	 */
	p.drawComponent = function() {

		var marginL = this.setup.bezelMarginL;
		var marginT = this.setup.bezelMarginT;
		var winLines = this.setup.winLines;
		var i, len = this.numLinesTotal = winLines.length, j;

		if (this.setup.enableWinLineShadows) {
			var filters = [];
			filters.push(this.dropShadow);
			filters.push(this.glowFilter);
		}

		var winLine;

		for (i = 0; i < len; i++) {

			var tempWinLines = [];
			this.winLines.push(tempWinLines);
			for (j = 0; j < 6; j++) {
				var tempArr;
				switch(j) {
					case 0 :
						tempArr = [0,0,0,0,0];
						break;
					case 1 :
						tempArr = [1,0,0,0,0];
						break;
					case 2 :
						tempArr = [1,1,0,0,0];
						break;
					case 3 :
						tempArr = [1,1,1,0,0];
						break;
					case 4 :
						tempArr = [1,1,1,1,0];
						break;
					case 5 :
						tempArr = [1,1,1,1,1];
						break;
				}

				winLine = new G.WinLine();
				winLine.init(this.setup, tempArr, winLines[i].data);
				winLine.color = winLines[i].color;
				this.addChild(winLine);
				winLine.drawComplete.add(this.onWinLineDrawn, this);
				winLine.drawComponent();
				winLine.x = marginL;
				winLine.y = marginT;
				winLine.visible = false;
				tempWinLines.push(winLine);
			}

		}
	};

	/**
	 * Once all win Line initialisation is done, we can hide the preloader cover
	 * @method onWinLineDrawn
	 */
	p.onWinLineDrawn = function() {
		++this.numLinesDrawn;
		if (this.numLinesDrawn === this.numLinesTotal) {
			this.cacheCompleted.dispatch();
		}
	};

	/**
	 * Hides all visible winLines
	 * @method hideWinLines
	 */
	p.hideWinLines = function() {

		var hideWinLine = function(winLine) {
			_.each(winLine, function(line) {
				line.visible = false;
			});
		};
		_.each(this.winLines, hideWinLine);
	};

	/**
	 * Shows all winlines at the passed indexes of setup.json winLines array
	 * @method showWinLinByIndexes
	 * @param {Array} indexes show winlines at these indexes eg: [1,3,5] shows winlines 1,3,5 together at once;
	 * @param {number} numSquares - number of winSquares to show on the winLine, 0 or absent draws a line
	 */
	p.showWinLineByIndexes = function(indexes, numSquares) {
		var i, len = indexes.length;
		var squaresIndex = numSquares || 0;
		for (i = 0; i < len; i++) {
			this.winLines[indexes[i]][squaresIndex].visible = true;
		}
	};

	G.WinLinesComponent = createjs.promote(WinLinesComponent, "GameComponent");

})();