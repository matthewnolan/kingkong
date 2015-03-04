/*! kingkong 0.2.2 - 2015-02-26
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Game component handling all particle animations
	 * Particle Animations are currently built using Proton.  It's a flexible particle system, chosen for it's
	 * multiple render mode support (supports Pixi.js and createjs, WebGL and others).
	 * Initial benchmarks prove the system animates very smoothly across devices, providing built animations operate within
	 * sensible thresholds and cleared up properly.
	 *
	 * @class ParticlesComponent
	 * @extends G.GameComponent
	 * @constructor
	 * @uses Proton
	 */
	var ParticlesComponent = function() {
		this.GameComponent_constructor();
	};
	var p = createjs.extend(ParticlesComponent, G.GameComponent);
	p.constructor = ParticlesComponent;

	/**
	 * @property proton
	 * @type {Proton}
	 */
	p.proton = null;

	/**
	 * @property renderer
	 * @type {Proton.Renderer}
	 */
	p.renderer = null;

	/**
	 *
	 * @type {HTMLElement}
	 */
	p.canvas = null;

	/**
	 * proton layer is scaled independently of the rest of the application because
	 * Proton rendering is handled by Proton.
	 * @type {number}
	 */
	p.stageScale = 1;

	/**
	 *
	 * @type {number}
	 */
	p.timeout = 1;

	/**
	 *
	 * @type {number}
	 */
	p.animationDurationTimeout = 1;


	p.fireWorkSpawnPosition = {
		x: 0,
		y: 0
	};

	/**
	 * initialise GameComponent
	 * @method init
	 * @param setup
	 * @param signalDispatcher
	 * @param {HTMLElement} canvas
	 * @param {number} stageScale
	 * @param {Proton} proton
	 * @param {Proton.Renderer} renderer
	 */
	p.init = function(setup, signalDispatcher, canvas, stageScale, proton, renderer) {
		this.GameComponent_init(setup, signalDispatcher);
		console.log('init', canvas);
		this.canvas = canvas;
		this.stageScale = stageScale;
		this.proton = proton;
		this.renderer = renderer;
		this.renderer.start();
		this.signalDispatcher.fireworkLaunched.add(this.launchFirework, this);

		this.fireWorkSpawnPosition.x = this.setup.stageW/2;
		this.fireWorkSpawnPosition.y = this.setup.stageH;
	};

	/**
	 * Start a firework animation for ms milliseconds. (or continuously if no ms param)
	 * @method smokeOn
	 * @param {number} ms - animation duration in milliseconds
	 */
	p.smokeOn = function(ms) {
		var self = this;

		if (ms) {
			this.animationDurationTimeout = setTimeout(function() {
				self.smokeOff();
			}, ms);
		}
		console.log('smoke on');
		self.launchFirework(0.2);
		self.launchFirework(0.3);
		self.launchFirework(0.5);
		self.launchFirework(0.7);
		self.launchFirework(0.8);

		this.timeout = setInterval(function() {
			self.launchFirework(0.2);
			self.launchFirework(0.3);
			self.launchFirework(0.5);
			self.launchFirework(0.7);
			self.launchFirework(0.8);
		}, 2000);
	};

	/**
	 * Ends a currently playing fireworks animatino
	 * @method smokeOff
	 */
	p.smokeOff = function() {

		console.log('smoke off', this);

		clearTimeout(this.animationDurationTimeout);
		clearInterval(this.timeout);
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
		this.emitter.addBehaviour(new Proton.Scale(new Proton.Span(0.01, 0.2)));
		this.emitter.addBehaviour(new Proton.RandomDrift(5, 0, 0.15));
		this.emitter.addBehaviour(new Proton.Gravity(0.9));
		this.emitter.emit();
		this.proton.addEmitter(this.emitter);
		this.renderer = new Proton.Renderer('easel', this.proton, this.stage);
	};

	/**
	 * Launches a firework with smoke effect.
	 * Each firework creates an emitter which emits 1 particle (the firework), when created, a new emitter is created and it's position is updated
	 * with the firework position, allowing a smoke trail effect to be emitted from the firework.
	 * @method launchFirework
	 */
	p.launchFirework = function(spawnPos) {

		var bitmap = new createjs.Bitmap('assets/images/firework_particle20x20.png');
		var emitter = new Proton.Emitter();
		var proton = this.proton;
		this.fireWorkSpawnPosition.x = spawnPos ? spawnPos * this.setup.stageW : this.fireWorkSpawnPosition.x;

		//removing bitmap until figured out the positioning bug
		//emitter.addInitialize(new Proton.ImageTarget(bitmap));
		//emitter.addInitialize(new Proton.Mass(1));
		//var scaleA = 1.5 * G.Utils.currentScale;
		//var scaleB = 8 * G.Utils.currentScale;
		emitter.addInitialize(new Proton.Radius(1));
		emitter.addInitialize(new Proton.Life(1,3));
		emitter.addInitialize(new Proton.Velocity(new Proton.Span(3, 12), new Proton.Span(-30, 30), 'polar'));
		emitter.addBehaviour(new Proton.RandomDrift(100, 50, 0.05));
		//emitter.addBehaviour(new Proton.Scale(scaleA, scaleB));
		emitter.p.x = this.fireWorkSpawnPosition.x;
		emitter.p.y = this.fireWorkSpawnPosition.y;

		var subEmitter;

		emitter.addEventListener(Proton.PARTICLE_CREATED, function(e) {
			var particle = e.particle;
			bitmap = new createjs.Bitmap('assets/images/sparkle.png');
			subEmitter = new Proton.Emitter();
			subEmitter.rate = new Proton.Rate(new Proton.Span(5, 10), new Proton.Span(0.005, 0.025));
			subEmitter.addInitialize(new Proton.ImageTarget(bitmap));
			subEmitter.addInitialize(new Proton.Mass(1));
			subEmitter.addInitialize(new Proton.Radius(1));
			subEmitter.addInitialize(new Proton.Life(1));
			subEmitter.addInitialize(new Proton.V(new Proton.Span(1, 3), new Proton.Span(170, 190), 'polar'));
			subEmitter.addBehaviour(new Proton.RandomDrift(10, 10, 0.05));
			subEmitter.addBehaviour(new Proton.Alpha(1, 0.1));
			subEmitter.addBehaviour(new Proton.Scale(3 * G.Utils.currentScale, 0.5 * G.Utils.currentScale));
			subEmitter.addBehaviour(new Proton.Color('ff0000', 'random', Infinity, Proton.easeOutQuart));
			subEmitter.p.x = particle.p.x;
			subEmitter.p.y = particle.p.y;
			subEmitter.emit();
			proton.addEmitter(subEmitter);
		});

		emitter.addEventListener(Proton.PARTICLE_UPDATE, function(e) {
			var pos = e.particle.p;
			subEmitter.p.x = pos.x;
			subEmitter.p.y = pos.y;
		});

		emitter.addEventListener(Proton.PARTICLE_DEAD, function() {
			emitter.removeAllEventListeners();
			emitter.destroy();
			subEmitter.stopEmit();
			emitter = null;
		});

		proton.addEmitter(emitter);
		emitter.emit("once", true);
	};




	G.ParticlesComponent = createjs.promote(ParticlesComponent, "GameComponent");

})();