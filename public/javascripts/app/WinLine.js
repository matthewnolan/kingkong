/*! kingkong 0.0.1 - 2015-02-07
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var WinLine = function() {
		this.Container_constructor();
	};
	var p = createjs.extend(WinLine, createjs.Container);
	p.constructor = WinLine;

	/**
	 * @default
	 * @usage 0 = Line, 1 = Square, 2 = Split Square
	 * @example - [1, 1 , 1, 0, 0] to draw winning symbol border boxes in the first 3 then a line in the final 2 [] [] [] - -
	 * @type {number[]}
	 */
	p.winLineSquares = [0, 0, 0, 0, 0];
	/**
	 * @default
	 * @usage 0 = top symbol, 1 = middle symbol, 2 = bottom symbol on a 3 line reel.  For greater visible reel height just increase the number
	 * @example - [0,0,0,1,2] would draw the line along the top row of the first 3 reels, then it would go through the next row and the last row in the final reel
	 * @type {number[]}
	 */
	p.symbolLocations = [1, 1, 1, 1, 1]; //


	/**
	 *
	 * @param winLineSquares
	 * @param symbolLocations
	 */
	p.init = function(winLineSquares, symbolLocations) {
		this.winLineSquares = winLineSquares;
		this.symbolLocations = symbolLocations;
	};


	p.draw = function() {



	};

	G.WinLine = createjs.promote(WinLine, "Container");

})();