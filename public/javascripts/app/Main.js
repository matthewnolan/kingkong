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
		this.launchFirework();

		createjs.Ticker.on("tick", this.handleTick, this);
		createjs.Ticker.setFPS(60);
	};

	p.createProton = function() {
		this.proton = new Proton();
		this.renderer = new Proton.Renderer('easel', this.proton, this.stage);
		this.renderer.onProtonUpdate = function() {

		};
		this.renderer.start();
	};

	p.createDaisyShower = function() {
		var bitmap = new createjs.Bitmap('javascripts/test/assets/daisy.png');

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


	p.launchFirework = function() {
		var bitmap = new createjs.Bitmap('javascripts/test/assets/daisy.png');
		var emitter = new Proton.Emitter();
		var proton = this.proton;
		var canvas = this.canvas;

		//emitter.rate = new Proton.Rate(1, new Proton.Span(0.1, 2));
		emitter.addInitialize(new Proton.ImageTarget(bitmap));
		emitter.addInitialize(new Proton.Mass(1));
		emitter.addInitialize(new Proton.Radius(1, 12));
		emitter.addInitialize(new Proton.Life(2));
		emitter.addInitialize(new Proton.Velocity(new Proton.Span(8, 15), new Proton.Span(-30, 30), 'polar'));
		emitter.addBehaviour(new Proton.RandomDrift(100, 100, 0.05));
		emitter.addBehaviour(new Proton.Color('ff0000', 'random', Infinity, Proton.easeOutQuart));
		emitter.addBehaviour(new Proton.Scale(1, 0.7));
		emitter.p.x = 300;
		emitter.p.y = 400;
		proton.addEmitter(emitter);
		emitter.emit("once", true);

		var self = this;
		var subEmitter;

		emitter.addEventListener(Proton.PARTICLE_UPDATE, function(e) {
			subEmitter.p.x = e.particle.p.x;
			subEmitter.p.y = e.particle.p.y;
		});

		emitter.addEventListener(Proton.PARTICLE_DEAD, function(e) {
			emitter.destroy();
			subEmitter.stopEmit();
		});

		emitter.addEventListener(Proton.PARTICLE_CREATED, function(e) {
			//console.log('Smoke on');
			var particle = e.particle;
			bitmap = new createjs.Bitmap('assets/images/particle.png');
			subEmitter = new Proton.Emitter();
			subEmitter.rate = new Proton.Rate(new Proton.Span(5, 10), new Proton.Span(0.005, 0.025));
			subEmitter.addInitialize(new Proton.ImageTarget(bitmap, 32));
			subEmitter.addInitialize(new Proton.Mass(1));
			subEmitter.addInitialize(new Proton.Radius(1, 12));
			subEmitter.addInitialize(new Proton.Life(1));
			subEmitter.addInitialize(new Proton.V(new Proton.Span(1, 3), new Proton.Span(170, 190), 'polar'));
			subEmitter.addBehaviour(new Proton.RandomDrift(10, 10, 0.05));
			subEmitter.addBehaviour(new Proton.Alpha(1, 0.1));

			subEmitter.addBehaviour(new Proton.Scale(0.1, 2));
			subEmitter.p.x = particle.x;//canvas.width / 2;
			subEmitter.p.y = particle.y;//canvas.height / 2;
			subEmitter.emit();
			proton.addEmitter(subEmitter);
		});
	};


	p.handleDaisyShowerStart = function() {
		this.launchFirework();
	};

	p.fpsSwitch = function() {

		var currentFrameRate = Math.round(createjs.Ticker.framerate);
		console.log('fpsSwitch: ', currentFrannmeRate);

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