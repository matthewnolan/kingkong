/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	var Main = function() {};
	var p = Main.prototype;
	p.constructor = Main;

	p.stats = null;

	p.stage = null;

	p.game = null;

	/**
	 * init
	 * Application Entry Point
	 */
	p.init = function() {

		this.stats = new Stats();
		this.stats.setMode(0); // 0: fps, 1: ms
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.bottom = '0px';
		this.stats.domElement.style.left = '0px';
		document.body.appendChild( this.stats.domElement );

		var stageW = 667;
		var stageH = 375;
		var stageScale = 1;

		this.stage = new createjs.Stage("app");
		this.stage.scaleX = stageScale;
		this.stage.scaleY = stageScale;

		var mainCanvas = document.querySelector("#app");
		mainCanvas.setAttribute("width", (stageW * stageScale).toString() + "px");
		mainCanvas.setAttribute("height", (stageH * stageScale).toString() + "px");

		createjs.Ticker.on("tick", this.handleTick, this);
		createjs.Ticker.setFPS(60);

		window.addEventListener('load', function() {
			console.log('Window Loaded');
			setTimeout(function() {
				window.scrollTo(0, 1);
			}, 0);
		}, false);

		var serverInterface = new G.ServerInterface();
		serverInterface.init();

		this.game = new G.Game();
		this.game.init(this.stage, serverInterface);

	};

	p.handleTick = function() {
		this.stats.begin();
		this.stage.update();
		this.stats.end();
	};



	G.Main = Main;

})();