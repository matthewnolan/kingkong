/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	/**
	 * Initialises preloading of assets, stores Setup, GameState, and GameComponents
	 * GameComponents are added to Stage
	 * Wires ServerInterface to GameComponents using a SignalDispatcher
	 * User Interface Events can defined set here.
	 * @class Game
	 * @constructor
	 */
	var Game = function() {};
	var p = Game.prototype;
	p.constructor = Game;

	/**
	 * Decides what scale mode is used to determine the scale and position of the canvas
	 * @example "NO_SCALE" - uses the default setup.json stageScale value;
	 * @example "FULL_BROWSER" - stretches the app to the viewport size;
	 * @default 'FULL_ASPECT - scales the app to the viewport, maintining aspect ratio'
	 * @Property STAGE_SCALE_MODE
	 * @type {string}
	 */
	p.STAGE_SCALE_MODE = "FULL_ASPECT";

	/**
	 * AUTO_GENERATED in all grunt builds
	 * @property version
	 * @type {string}
	 */
	p.version = "{{ VERSION }}";

	/**
	 * @property setup
	 * @type {Object}
	 */
	p.setup = null;

	/**
	 * @property serverInterface
	 * @type {G.ServerInterface}
	 */
	p.serverInterface = null;

	/**
	 * @property stage
	 * @type {createjs.Stage}
	 */
	p.stage = null;

	/**
	 * Override this value in setup.json
	 * @property stageScale
	 * @type {number}
	 */
	p.stageScale = 1;

	/**
	 * @property assets
	 * @type {Object}
	 */
	p.assets = null;

	/**
	 * Game Events be listened to and dispatched from here. Should be passed to GameComponents which require it.
	 * @property signalDispatcher
	 * @type {G.SignalDispatcher}
	 */
	p.signalDispatcher = null;

	/**
	 * GameComponents stored here
	 * @property components
	 * @type {{reels: null, winLines: null}}
	 */
	p.components = {
		reels: null,
		winLines: null
	};

	/**
	 * @property fpsSwitcher
	 * @type {Signal}
	 */
	p.fpsSwitcher = new signals.Signal();

	/**
	 * @property displayInitialised
	 * @type {Signal}
	 */
	p.displayInitialised = new signals.Signal();

	/**
	 * @property daisyShowerStarted
	 * @type {Signal}
	 */
	p.daisyShowerStarted = new signals.Signal();

	/**
	 * @property gameComponents
	 * @type {G.GameComponent[]}
	 */
	p.gameComponents = [];

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
	 * init: Game entry point, create Preloader and accept a Display root (currently createjs.stage), and ServerInterface.
	 * Starts Preloading of assets
	 */
	p.init = function() {
		this.stage = new createjs.Stage("app");

		this.stats = new Stats();

		var serverInterface = new G.ServerInterface();
		serverInterface.init();

		this.signalDispatcher = new G.SignalDispatcher();

		var preloader = new G.Preloader();
		preloader.init(this, this.SETUP_URL);
		preloader.setupComplete.add(this.onSetupLoaded, this);
		preloader.assetsLoaded.add(this.onAssetsLoadComplete, this);
		preloader.startLoad();

		//this.displayInitialised.add(this.displayInitialised, this);
		this.signalDispatcher.fpsSwitched.add(this.fpsSwitch, this);
		this.signalDispatcher.daisyShowerStarted.add(this.handleDaisyShowerStart, this);
	};


	/**
	 * SignalHandler which saves setup data when loaded by Preloader
	 * @param {Object} setup - Setup Object which is loaded from setup.json file
	 * @event onSetupLoaded
	 */
	p.onSetupLoaded = function(setup) {
		this.setup = setup;
		this.rescale();
	};

	/**
	 * Signal Handler
	 * onAssetsLoadComplete: Asets have been loaded.  Now initialise the Display,
	 * Initialise UI Events, and Create a SignalDispatcher
	 * @param {Object} assets
	 * @event onAssetsLoadComplete
	 */
	p.onAssetsLoadComplete = function(assets) {
		this.assets = assets;

		this.setupDisplay();
		this.initUIEvents();

		createjs.Ticker.on("tick", this.handleTick, this);
		createjs.Ticker.setFPS(60);
	};

	p.rescale = function() {
		var stageW = this.setup.stageW || 667;
		var stageH = this.setup.stageH || 375;
		var browserW = window.innerWidth;
		var browserH = window.innerHeight;
		this.stageScale = this.setup.stageScale || 1;
		var stageScaleW = this.stageScale, stageScaleH = this.stageScale;
		var appLeft = 0;
		var appWidth = Math.floor(stageW * stageScaleW);
		var appHeight = Math.floor(stageH * stageScaleH);

		if (this.setup.scale) {
			this.STAGE_SCALE_MODE = this.setup.scale;
		}

		switch(this.STAGE_SCALE_MODE) {
			case "FULL_ASPECT" :
				stageScaleH = stageScaleW = browserH / stageH;
				appWidth = Math.floor(stageW * stageScaleW);
				appHeight = Math.floor(stageH * stageScaleH);

				if (appWidth > browserW) {
					stageScaleW = stageScaleH = browserW / stageW;
				}


				appLeft = Math.floor(browserW / 2 - appWidth /2);
				break;
			case "FULL_BROWSER" :
				stageScaleH = browserH / stageH;
				stageScaleW = browserW / stageW;
				appWidth = Math.floor(stageW * stageScaleW);
				appHeight = Math.floor(stageH * stageScaleH);
				break;
			case "NO_SCALE" :
				//defaults are fine
				break;
			default :

				break;
		}

		this.stage.scaleX = this.stageScale = stageScaleW;
		this.stage.scaleY = stageScaleH;

		//No negative left
		appLeft = appLeft < 0? 0 : appLeft;

		var styleWidth = appWidth.toString() + "px";
		var styleHeight = appHeight.toString() + "px";
		var styleLeft = appLeft.toString() + "px";

		var preloaderCover = document.querySelector("#preloader");
		preloaderCover.style.width = styleWidth;
		preloaderCover.style.height = styleHeight;

		var mainCanvas = document.querySelector("#app");
		mainCanvas.setAttribute("width", styleWidth );
		mainCanvas.setAttribute("height", styleHeight);
		mainCanvas.style.left = styleLeft;

		this.canvas = mainCanvas;

		//html console (useful for mobile debug)
		if (this.setup.htmlDebug) {
			console.log('window.screen.availHeight=', window.screen.availHeight);
			var debugStr = "setup.htmlDebug:" + this.setup.htmlDebug;
			debugStr += "<br/>availHeight=" + window.screen.availHeight;
			debugStr += "<br/>availWidth=" + window.screen.availWidth;
			debugStr+= "<br/>innerHeight=" + window.innerHeight;
			debugStr+= "<br/>innerWidth=" + window.innerWidth;

			if (window.innerHeight > window.innerWidth) {
				debugStr+="<br/>portrait mode";
			} else {
				debugStr+="<br/>landscape mode";
			}
			//canvas console
			//var debug = new createjs.Text("debug:\n" + debugStr, "14px Arial", "#ffffff");
			//this.stage.addChild(debug);
			//debug.y = 0;
			//debug.x = 0;
			//html console
			var debug = document.querySelector("#console");
			debug.innerHTML = debugStr;
		}
	};

	/**
	 * setupDisplay: Start layering Containers and GameComponents.  Mask the stage for reels.
	 * nb. These are potentially expensive cpu operations, but everything done here is done after Preload and during app initialisation.
	 * Any filters applied to display objects will magnify the length of time this function takes to complete.
	 * @method setupDisplay
	 */
	p.setupDisplay = function() {
		var bezelMarginL = this.setup.bezelMarginL;
		var bezelMarginT = this.setup.bezelMarginT;
		var bezelW = this.setup.bezelW;
		var bezelH = this.setup.bezelH;

		//init background
		var spriteSheet = new createjs.SpriteSheet(this.assets.spriteSheetStatics);
		var sprite = new createjs.Sprite(spriteSheet, 'ui-bezel');
		this.stage.addChild(sprite);

		//stats
		this.stats.setMode(0); // 0: fps, 1: ms
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.bottom = '0px';
		this.stats.domElement.style.left = '0px';
		document.body.appendChild( this.stats.domElement );

		//init reels
		var reelsComponent = new G.ReelsComponent();
		reelsComponent.init(this.setup, this.signalDispatcher, spriteSheet);
		reelsComponent.drawReels();
		reelsComponent.x = bezelMarginL;
		reelsComponent.y = bezelMarginT;
		this.stage.addChild(reelsComponent);

		//store components
		this.components.reels = reelsComponent;
		this.signalDispatcher.init(this.setup, this.gameComponents);

		//init mask
		var sceneMask = new createjs.Shape();
		sceneMask.graphics.setStrokeStyle(0)
			.drawRect(bezelMarginL, bezelMarginT, bezelW, bezelH)
			.closePath();
		this.stage.addChild(sceneMask);

		//init symbolWins
		var symbolWinsComponent = new G.SymbolWinsComponent();
		symbolWinsComponent.init(this.setup, this.signalDispatcher, this.assets.spriteSheetSymbolAnims);
		symbolWinsComponent.x = bezelMarginL;
		symbolWinsComponent.y = bezelMarginT;
		this.stage.addChild(symbolWinsComponent);
		symbolWinsComponent.drawSprites();
		this.components.symbolWins = symbolWinsComponent;
		this.gameComponents.push(symbolWinsComponent);

		var bigWinComponent = new G.BigWinComponent();
		bigWinComponent.init(this.setup, this.signalDispatcher, this.assets.spriteSheetBigWin);
		bigWinComponent.x = bezelMarginL;
		bigWinComponent.y = bezelMarginT;
		this.stage.addChild(bigWinComponent);
		bigWinComponent.drawSprites();

		//init winLines
		var winLinesComponet = new G.WinLinesComponent();
		winLinesComponet.init(this.setup, this.signalDispatcher);
		this.stage.addChild(winLinesComponet);
		winLinesComponet.drawComponent();
		this.components.winLines = winLinesComponet;
		this.gameComponents.push(reelsComponent, winLinesComponet);
		this.components.bigWin = bigWinComponent;
		this.gameComponents.push(bigWinComponent);

		var gaffMenu = new G.GaffMenuComponent(this.version);
		gaffMenu.init(this.setup, this.signalDispatcher);
		gaffMenu.drawMenu();
		this.stage.addChild(gaffMenu);
		gaffMenu.x = bezelMarginL + (bezelW / 2);
		gaffMenu.y = bezelMarginT + (bezelH / 2);

		console.log('gaff', gaffMenu.x, gaffMenu.y);

		this.components.gaff = gaffMenu;
		this.gameComponents.push(gaffMenu);

		G.Utils.gameComponents = this.gameComponents;

		if (!this.setup.devMode) {
			reelsComponent.mask = sceneMask;
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

	/**
	 * User Control is initialised: Keyboard control / touch controls
	 * if User Control shouldn't be enabled during app initialisation phase, then execute this function later.
	 * @todo - configure a way to turn on/off user interaction events.
	 * @method initUIEvents
	 */
	p.initUIEvents = function() {
		var self = this;
		/**
		 * Fix position of app on rotate
		 */
		window.addEventListener('resize', function() {
			window.scrollTo(0, 0);
			self.rescale();
		}, true);

		window.document.onkeydown = function(e) {

			switch(e.keyCode) {
				//space //enter
				case 32:
				case 0:
					self.components.reels.spinReels();
					break;
				////shift+g
				case 71 :
					self.components.gaff.show();
					break;
				case 70 :
					self.signalDispatcher.daisyShowerStarted.dispatch();
					break;
			}
		};

		createjs.Touch.enable(this.stage);

		var myElement = document.querySelector('#app');
		var mc = new Hammer(myElement);
		mc.get('swipe').set({
			direction: Hammer.DIRECTION_DOWN
		});

		mc.get('pinch').set({
			enable: true
		});

		mc.on('swipe', function() {
			self.components.reels.spinReels();
		});

		mc.on('pinchin', function() {
			self.components.gaff.hide();
		});

		mc.on('pinchout', function() {
			self.components.gaff.show();
		});

		if (!this.setup.domHelpers) {
			//$('.dom-helpers').remove();

			var domHelpers = document.querySelector(".dom-helpers");
			domHelpers.parentNode.removeChild(domHelpers);
		}
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

		emitter.p.x = (canvas.width / this.stageScale) / 2;
		emitter.p.y = canvas.height / this.stageScale;

		console.log('emitter start:', emitter.p);

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




	G.Game = Game;

})();