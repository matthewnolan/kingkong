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

		var stage = new createjs.Stage("app");

		createjs.Ticker.addEventListener("tick", handleTick);
		createjs.Ticker.setFPS(60);

		function handleTick() {
			stats.begin();
			stage.update();
			stats.end();
		}

		//auto scroll for fullscreen hack
		window.addEventListener('load', function(e) {
			console.log('Window Loaded');
			setTimeout(function() {
				window.scrollTo(0, 1);
			}, 0);
		}, false);

		var preloader = new G.Preloader();
		preloader.init();

		var serverInterface = new G.ServerInterface();
		serverInterface.init();

		var game = new G.Game();
		game.init();



	};


	G.Main = Main;

})();