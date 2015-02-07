/*! kingkong 0.0.1 - 2015-02-07
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var WinLinesComponent = function() {
		this.Container_constructor();
	};
	var p = createjs.extend(WinLinesComponent, createjs.Container);
	p.constructor = WinLinesComponent;


	p.init = function() { 

	};

	G.WinLinesComponent = createjs.promote(WinLinesComponent, "Container");

})();