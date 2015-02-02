/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var Main = function() {};
	var p = Main.prototype;
	p.constructor = Main;

	/**
	 * init
	 * Application Entry Point
	 */
	p.init = function() {

		var stats = new Stats();
		stats.setMode(0); // 0: fps, 1: ms
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.bottom = '0px';
		stats.domElement.style.left = '0px';
		document.body.appendChild( stats.domElement );

		var update = function () {

			stats.begin();

			// monitored code goes here

			stats.end();

			requestAnimationFrame( update );

		};

		requestAnimationFrame( update );

	};

	G.Main = Main;

})();