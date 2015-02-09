/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * @class
	 * @constructor
	 */
	var Command = function() {};
	var p = Command.prototype;
	p.constructor = Command;

	p.loopIndex = 0;
	p.callNextDelay = 2000;

	p.init = function() { 
		console.log("Command innit");
	};

	p.execute = function() {
		console.log("Command execute");
	};

	G.Command = Command;

})();