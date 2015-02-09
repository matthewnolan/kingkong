/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	/**
	 * The Main Class should give the app its entry point.
	 * No other entry points should be used by the index.html
	 * @class Main
	 * @constructor
	 */
	var Main = function() {};
	var p = Main.prototype;
	p.constructor = Main;

	/**
	 * Stores reference to Stats, this is a profiling tool which displays FPS and MSPF
	 * @property stats
	 * @type {Stats}
	 */
	p.stats = null;

	/**
	 * Stores a reference to Stage Object, a Special Container which is at the root of the Canvas
	 * @property stage
	 * @type {createjs.Stage}
	 */
	p.stage = null;

	/**
	 * Stores a reference to G.Game, Everything a KingKong game is created by this Object or passed into it during initialisation.
	 * @property game
	 * @type {G.Game}
	 */
	p.game = null;

	/**
	 * Application entry point initialises the canvas viewport (currently createjs) and the Game
	 * @method init
	 *
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
		var stageScale = 0.75;

		this.stage = new createjs.Stage("app");
		this.stage.scaleX = stageScale;
		this.stage.scaleY = stageScale;

		var mainCanvas = document.querySelector("#app");
		mainCanvas.setAttribute("width", (stageW * stageScale).toString() + "px");
		mainCanvas.setAttribute("height", (stageH * stageScale).toString() + "px");

		createjs.Ticker.on("tick", this.handleTick, this);
		createjs.Ticker.setFPS(60);

		var serverInterface = new G.ServerInterface();
		serverInterface.init();

		this.game = new G.Game();
		this.game.init(this.stage, serverInterface);

	};

	/**
	 * Render Tick which updates Stage and any profiling tool.
	 * @method handleTick
	 */
	p.handleTick = function() {
		this.stats.begin();
		this.stage.update();
		this.stats.end();
	};



	G.Main = Main;

})();