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
	 * @type {number[]}
	 */
	p.winLineSquares = [0, 0, 0, 0, 0];
	/**
	 * @default
	 * @usage 0 = top symbol, 1 = middle symbol, 2 = bottom symbol on a 3 line reel.  For greater visible reel height just increase the number
	 * @type {number[]}
	 */
	p.symbolLocations = [1, 1, 1, 1, 1]; //




	p.init = function(winLineSquares, symbolLocations) {

	};


	p.draw = function() {



	};

	G.WinLine = createjs.promote(WinLine, "Container");

})();