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
	 * Stores passed setup data
	 * @method init
	 * @param setup
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
		var i, len = winLines.length;

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
			winLine.drawComponent();
			winLine.x = marginL;
			winLine.y = marginT;
			winLine.visible = false;
			this.winLines.push(winLine);
		}
	};

	p.clearWinLines = function() {

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