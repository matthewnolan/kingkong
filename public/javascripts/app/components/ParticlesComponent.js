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
		this.signalDispatcher.fireworkLaunched.add(this.handleDaisyShowerStart, this);
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

		this.timeout = setInterval(function() {
			self.launchFirework();
		}, 550);
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
	p.launchFirework = function() {
		var bitmap = new createjs.Bitmap('javascripts/test/assets/daisy.png');
		var emitter = new Proton.Emitter();
		var proton = this.proton;
		var canvas = this.canvas;

		//emitter.rate = new Proton.Rate(1, new Proton.Span(0.1, 2));
		emitter.addInitialize(new Proton.ImageTarget(bitmap));
		emitter.addInitialize(new Proton.Mass(1));
		//emitter.addInitialize(new Proton.Radius(1, 12));
		emitter.addInitialize(new Proton.Life(2));
		emitter.addInitialize(new Proton.Velocity(new Proton.Span(8, 15), new Proton.Span(-30, 30), 'polar'));
		//emitter.addBehaviour(new Proton.Scale(new Proton.Span(0.01, 0.2)));
		emitter.addBehaviour(new Proton.RandomDrift(100, 100, 0.05));
		emitter.addBehaviour(new Proton.Color('ff0000', 'random', Infinity, Proton.easeOutQuart));
		var scaleMin = 0.25 * this.stageScale;
		var scaleMax = 0.75 * this.stageScale;
		emitter.addBehaviour(new Proton.Scale(scaleMin, scaleMax));
		emitter.p.x = this.setup.stageW / 2;
		emitter.p.y = this.setup.stageH;

		console.log('o=', emitter.p);

		proton.addEmitter(emitter);
		emitter.emit("once", true);

		var subEmitter;

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

		emitter.addEventListener(Proton.PARTICLE_UPDATE, function(e) {
			subEmitter.p.x = e.particle.p.x;
			subEmitter.p.y = e.particle.p.y;
		});

		emitter.addEventListener(Proton.PARTICLE_DEAD, function() {
			emitter.destroy();
			subEmitter.stopEmit();
		});
	};


	p.handleDaisyShowerStart = function() {
		this.launchFirework();
	};







	G.ParticlesComponent = createjs.promote(ParticlesComponent, "GameComponent");

})();