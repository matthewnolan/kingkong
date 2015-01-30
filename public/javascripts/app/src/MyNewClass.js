/*! kingkong 0.0.1 - 2015-01-30
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var MyNewClass = function() {};
	var p = MyNewClass.prototype;
	p.constructor = MyNewClass;


	p.init = function() { 

	};

	G.MyNewClass = MyNewClass;

})();