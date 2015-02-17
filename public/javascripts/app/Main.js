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
	 * Decides what scale mode is used to determine the scale and position of the canvas
	 * @example "NO_SCALE";
	 * @example "FULL_BROWSER";
	 * @default 'FULL_ASPECT'
	 * @Property STAGE_SCALE_MODE
	 * @type {string}
	 */
	p.STAGE_SCALE_MODE = "FULL_ASPECT";

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
		var browserW = window.innerWidth;
		var browserH = window.innerHeight;
		var stageScaleW = 1, stageScaleH = 1;
		var appLeft = 0;
		var appWidth = Math.floor(stageW * stageScaleW);
		var appHeight = Math.floor(stageH * stageScaleH);

		switch(this.STAGE_SCALE_MODE) {
			case "FULL_ASPECT" :
				stageScaleH = stageScaleW = browserH / stageH;
				appWidth = Math.floor(stageW * stageScaleW);
				appHeight = Math.floor(stageH * stageScaleH);
				appLeft = Math.floor(browserW / 2 - appWidth /2);
				break;
			case "NO_SCALE" :
				//defaults are fine

				break;
			case "FULL_BROWSER" :
				stageScaleH = browserH / stageH;
				stageScaleW = browserW / stageW;
				appWidth = Math.floor(stageW * stageScaleW);
				appHeight = Math.floor(stageH * stageScaleH);
				break;
			default :
				//default is fine
				break;
		}

		this.stage = new createjs.Stage("app");
		this.stage.scaleX = stageScaleW;
		this.stage.scaleY = stageScaleH;

		var styleWidth = appWidth.toString() + "px";
		var styleHeight = appHeight.toString() + "px";
		var styleLeft = appLeft.toString() + "px";

		var mainCanvas = document.querySelector("#app");
		mainCanvas.setAttribute("width", styleWidth );
		mainCanvas.setAttribute("height", styleHeight);
		mainCanvas.style.left = styleLeft;


		var preloaderCover = document.querySelector("#preloader");
		preloaderCover.style.width = styleWidth;
		preloaderCover.style.height = styleHeight;

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