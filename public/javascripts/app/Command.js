/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var Command = function() {};
	var p = Command.prototype;
	p.constructor = Command;

	p.loopIndex = 0;
	p.callNextDelay = 2000;

	p.init = function() { 

	};

	p.execute = function() {

	};

	G.Command = Command;

})();