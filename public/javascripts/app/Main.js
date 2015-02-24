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
	 * proton
	 * @type {Proton}
	 */
	p.proton = null;

	/**
	 *
	 * @type {null}
	 */
	p.emitter = null;

	/**
	 *
	 * @type {HTMLElement}
	 */
	p.canvas = null;

	/**
	 *
	 * @type {boolean}
	 */
	p.isShower = false;

	/**
	 * Application entry point initialises the stage canvas and G.Game
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

		this.stage = new createjs.Stage("app");

		this.game = new G.Game();
		this.game.init(this.stage);
		this.game.displayInitialised.add(this.displayInitialised, this);
		this.game.signalDispatcher.fpsSwitched.add(this.fpsSwitch, this);
		this.game.signalDispatcher.daisyShowerStarted.add(this.handleDaisyShowerStart, this);
	};

	/**
	 * @signalHandler
	 * @method displayInitialised
	 */
	p.displayInitialised = function() {
		this.canvas = document.querySelector("#app");

		this.createProton();

		createjs.Ticker.on("tick", this.handleTick, this);
		createjs.Ticker.setFPS(60);
	};

	p.createProton = function() {
		var bitmap = new createjs.Bitmap('javascripts/test/assets/daisy.png');

		this.proton = new Proton();
		this.emitter = new Proton.Emitter();
		this.emitter.rate = new Proton.Rate(new Proton.Span(30, 40), new Proton.Span(0.5, 2));
		this.emitter.addInitialize(new Proton.ImageTarget(bitmap));
		this.emitter.addInitialize(new Proton.Mass(1, 5));
		this.emitter.addInitialize(new Proton.Radius(20));
		this.emitter.addInitialize(new Proton.Position(new Proton.LineZone(0, -40, this.canvas.width, -40)));
		this.emitter.addInitialize(new Proton.V(0, new Proton.Span(0.1, 1)));

		this.emitter.addBehaviour(new Proton.CrossZone(new Proton.LineZone(0, this.canvas.height, this.canvas.width, this.canvas.height + 20, 'down'), 'dead'));
		this.emitter.addBehaviour(new Proton.Rotate(new Proton.Span(0, 360), new Proton.Span(-0.5, 0.5), 'add'));
		this.emitter.addBehaviour(new Proton.Scale(new Proton.Span(0.2, 1)));
		this.emitter.addBehaviour(new Proton.RandomDrift(5, 0, 0.15));
		this.emitter.addBehaviour(new Proton.Gravity(0.9));
		this.emitter.emit();
		this.proton.addEmitter(this.emitter);
		this.renderer = new Proton.Renderer('easel', this.proton, this.stage);
	};

	p.handleDaisyShowerStart = function() {
		if (this.isShower) {
			this.isShower = false;
			this.emitter.stopEmit();
		} else {
			this.isShower = true;
			this.renderer.start();
			this.emitter.emit();
		}
	};

	p.fpsSwitch = function() {

		var currentFrameRate = Math.round(createjs.Ticker.framerate);
		console.log('fpsSwitch: ', currentFrameRate);

		if (currentFrameRate <= 30) {
			createjs.Ticker.setFPS(60);
		} else {
			createjs.Ticker.setFPS(30);
		}
	};

	/**
	 * Render Tick which updates Stage and any profiling tool.
	 * @method handleTick
	 */
	p.handleTick = function() {
		this.stats.begin();
		this.proton.update();
		this.stage.update();
		this.stats.end();
	};



	G.Main = Main;

})();