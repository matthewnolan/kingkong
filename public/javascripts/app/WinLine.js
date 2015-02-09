/*! kingkong 0.0.1 - 2015-02-07
 * Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * @class WinLine
	 * @constructor
	 */
	var WinLine = function () {
		this.Container_constructor();
	};
	var p = createjs.extend(WinLine, createjs.Container);
	p.constructor = WinLine;

	/**
	 *
	 * Store data for telling the win line what to draw
	 *
	 * @property winLineSquares
	 * @required
	 * @usage 0 = Line, 1 = Square, 2 = Split Square
	 * @example - [1, 1 , 1, 0, 0] to draw winning symbol border boxes in the first 3 then a line in the final 2 [] [] [] - -
	 * @default - [0,0,0,0,0]
	 * @type {number[]}
	 */
	p.winLineSquares = [0, 0, 0, 0, 0];
	/**
	 *
	 * Store data required to locate the win line on the reel
	 * @property symbolLocations
	 * @required
	 * @usage 0 = top symbol, 1 = middle symbol, 2 = bottom symbol on a 3 line reel.  For greater visible reel height just increase the number
	 * @example - [0,0,0,1,2] would draw the line along the top row of the first 3 reels, then it would go through the next row and the last row in the final reel
	 * @default [1, 1, 1, 1, 1]
	 * @type {number[]}
	 */
	p.symbolLocations = [1, 1, 1, 1, 1];

	/**
	 * Stores game setup
	 *
	 * @property setup
	 * @required
	 * @type {Object}
	 */
	p.setup = null;

	/**
	 * Line Color
	 * @property color
	 * @example "#ff0000",
	 * @default "#ff0000",
	 * @type {string}
	 */
	p.color = "#ff0000";

	/**
	 * Line Thickness in pixels
	 * @property thickness
	 * @default 5
	 * @type {number}
	 */
	p.thickness = 5;

	/**
	 * Stores the glowFilter reference
	 * @property glowFilter
	 * @type {createjs.GlowFilter}
	 */
	p.glowFilter = null;


	/**
	 * Stores the dropShadow reference
	 * @property dropShadowFilter
	 * @type {createjs.DropShadowFilter}
	 */
	p.dropshadowfilter = null;

	/**
	 * Stores the WinLine Data in preparation for drawing
	 * @method init
	 * @param {Object} setup
	 * @param {Array} winLineSquares - prepare to draw a line or square at this index
	 * @param {Array} symbolLocations - prepare to draw a line or square at this vartical location and this index
	 */
	p.init = function (setup, winLineSquares, symbolLocations) {
		this.setup = setup;
		this.winLineSquares = winLineSquares || this.winLineSquares;
		this.symbolLocations = symbolLocations || this.symbolLocations;

		this.setupDropShadow();
		this.setupGlowFilter();
	};

	/**
	 * Draws the WinLine according to stored Data
	 * @method draw
	 */
	p.drawComponent = function () {

		console.log('winLineComponent.draw');

		var symbolW = this.setup.symbolW;
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var reelMarginR = this.setup.reelMarginRight;

		var shape = new createjs.Shape();
		var graph = shape.graphics;

		graph.setStrokeStyle(this.thickness);
		graph.beginStroke(this.color);
		graph.moveTo(0, 0);

		this.addChild(shape);

		var i, len = this.symbolLocations.length;
		for (i = 0; i < len; i++) {
			var x = i * symbolW + i * reelMarginR + this.thickness / 2;
			var y = this.symbolLocations[i] * symbolH + this.symbolLocations[i] * symbolMarginB + this.thickness / 2;
			var outlineW = symbolW - this.thickness;
			var outlineH = symbolH - this.thickness + 1;

			var drawPoint = {
				x: x + outlineW + this.thickness * 2,
				y: y + outlineH / 2
			};

			if (i === 0) {
				//is first reel
				graph.moveTo(x, drawPoint.y);
			}

			if (i < len - 1) {
				//not last reel

				if (this.winLineSquares[i] === 1) {
					//draw a square

					graph.drawRect(x, y, outlineW, outlineH);

					if (this.symbolLocations[i + 1] === this.symbolLocations[i]) {
						//next reel is same row
						gp.moveTo(x + outlineW, y + outlineH / 2);
					}

					if (this.symbolLocations[i + 1] === this.symbolLocations[i] + 1) {
						//next reel is on row below
						gp.moveTo(x + outlineW, y + outlineH);
						drawPoint.y = y + outlineH + this.thickness * 2;
					}

					if (this.symbolLocations[i + 1] === this.symbolLocations[i] - 1) {
						//next reel is ont the row above
					}
				} else {
					//draw a line
					graph.lineTo(x + symbolW / 2, drawPoint.y);
					if (this.symbolLocations[i + 1] === this.symbolLocations[i]) {
						//draw straight line to next reel
						//drawPoint has correct values already
					}

					if (this.symbolLocations[i + 1] === this.symbolLocations[i] + 1) {
						//draw straight line to row below
						//modify drawPoint y pos
						drawPoint.y = y + symbolH;
					}
					if (this.symbolLocations[i + 1] === this.symbolLocations[i] - 1) {
						//draw straight line to row above
						//modify drawPoint y pos
						drawPoint.y = y - this.thickness / 2;
					}
				}
			} else if (i === len - 1) {
				// is last reel

				if (this.winLineSquares[i] === 1) {
					graph.drawRect(x, y, outlineW, outlineH);
					graph.moveTo(drawPoint.x, drawPoint.y);
				} else {
					graph.lineTo(x + symbolW / 2, drawPoint.y);
					drawPoint.x = x + symbolW - 2;
				}
			}
			graph.lineTo(drawPoint.x, drawPoint.y);
		}

		if (this.setup.enableWinLineShadows) {
			var filters = [];
			filters.push(this.dropShadow);
			filters.push(this.glowFilter);
			shape.filters = filters;
			shape.setBounds(0,0, this.setup.bezelW, this.setup.bezelH);
			var bounds = shape.getBounds();
			shape.cache(bounds.x, bounds.y, bounds.width, bounds.height);
		}
	};

	/**
	 * initialises DropShadow variables
	 * @method setupDropShadow
	 */
	p.setupDropShadow = function() {
		var distance = 1;
		var angle = 90;
		var colour = 0xffffff;
		var alpha = 1;
		var blurX = 2;
		var blurY = 2;
		var strength = 2;
		var quality = 2;
		var inner = true;
		var knockout = false;
		var hideObject = false;
		this.dropShadow = new createjs.DropShadowFilter(distance, angle, colour, alpha, blurX, blurY, strength, quality, inner, knockout, hideObject);
	};

	/**
	 * initialises GlowFilter variables
	 * @method setupGlowFilter
	 */
	p.setupGlowFilter = function() {
		var color = 0x000000;
		var alpha = 0.7;
		var blurX = 2;
		var blurY = 2;
		var strength = 5;
		var quality = 2;
		var inner = false;
		var knockout = false;
		this.glowFilter = new createjs.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
	};

	G.WinLine = createjs.promote(WinLine, "Container");

})();