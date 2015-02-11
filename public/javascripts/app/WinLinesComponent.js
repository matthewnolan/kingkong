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
	 * @property el
	 * @type {HTMLElement}
	 */
	p.el = null;

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
		var i, len = this.numLinesTotal = winLines.length;

		this.el = document.querySelector("#preloader");

		if (this.setup.enableShadowsOnDesktop) {
			var filters = [];
			filters.push(this.dropShadow);
			filters.push(this.glowFilter);
		}

		for (i = 0; i < len; i++) {
			var winLine = new G.WinLine();
			winLine.init(this.setup, [0,0,0,0,0], winLines[i].data);
			winLine.color = winLines[i].color;
			this.addChild(winLine);
			winLine.drawComplete.add(this.onWinLineDrawn, this);
			winLine.drawComponent();
			winLine.x = marginL;
			winLine.y = marginT;
			winLine.visible = false;
			this.winLines.push(winLine);
		}



		//this.hideWinLines();
	};

	p.onWinLineDrawn = function() {
		++this.numLinesDrawn;
		if (this.numLinesDrawn === this.numLinesTotal) {
			this.el.style.visibility = "hidden";
		}
	};

	/**
	 * Hides all visible winLines
	 * @method hideWinLines
	 */
	p.hideWinLines = function() {

		var hideWinLine = function(winLine) {
			winLine.visible = false;
		};

		_.each(this.winLines, hideWinLine);
	};

	/**
	 * Shows all winlines at the passed indexes of setup.json winLines array
	 * @method showWinLinByIndexes
	 * @param {Array} indexes show winlines at these indexes eg: [1,3,5] shows winlines 1,3,5 together at once;
	 */
	p.showWinLineByIndexes = function(indexes) {
		var i, len = indexes.length;
		for (i = 0; i < len; i++) {
			this.winLines[indexes[i]].visible = true;
		}
	};


	G.WinLinesComponent = createjs.promote(WinLinesComponent, "GameComponent");

})();