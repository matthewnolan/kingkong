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
	 *
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
	p.fireworkLaunched = new signals.Signal();

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
	 * @property particlesComponent
	 * @type {G.ParticlesComponent}
	 */
	p.particlesComponent = null;

	/**
	 * @property reelsComponent
	 * @type {G.ReelsComponent}
	 */
	p.reelsComponent = null;

	/**
	 * @property reelsComponent
	 * @type {G.GaffMenuComponent}
	 */
	p.gaffMenu = null;

	/**
	 * Number of initialised game components to check have initialised before loader is removed
	 * @property initialisedNum
	 * @default 3
	 * @type {number}
	 */
	p.initailisedNum = 3;

	/**
	 * @property preloaderEl
	 * @default null
	 * @type {HTMLElement}
	 */
	p.preloaderEl = null;

	/**
	 * @property serverInterface
	 * @default null
	 * @type {G.ServerInterface}
	 */
	p.serverInterface = null;

	/**
	 *
	 * @type {null}
	 */
	p.gameData = null;

	/**
	 * init: Game entry point, create Preloader and accept a Display root (currently createjs.stage), and ServerInterface.
	 * Starts Preloading of assets
	 */
	p.init = function() {
		this.stats = new Stats();

		this.signalDispatcher = new G.SignalDispatcher();
		this.signalDispatcher.fpsSwitched.add(this.fpsSwitch, this);

		this.gameData = new G.GameData();
		this.gameData.slotInitCompleted.add(this.slotInitReceived, this);

		this.serverInterface = new G.ServerInterface();
		this.serverInterface.init(this.signalDispatcher, this.gameData);
		this.serverInterface.requestSlotInit();

		this.stage = new createjs.Stage("app");
		createjs.Ticker.on("tick", this.handleTick, this);
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		createjs.Ticker.setFPS(60);

		this.proton = new Proton();



		//this.displayInitialised.add(this.displayInitialised, this);
	};


	/**
	 * SignalHandler which saves setup data when loaded by Preloader
	 * @param {Object} setup - Setup Object which is loaded from setup.json file
	 * @event onSetupLoaded
	 */
	p.onSetupLoaded = function(setup) {
		this.setup = setup;

		if (this.setup.enableDesktopView && device.desktop()) {
			this.STAGE_SCALE_MODE = "NO_SCALE";
			var body = document.querySelector("body");
			body.className = body.className + " layoutDesktop";
			if (QRCode){
				new QRCode(document.getElementById("qrcode"), {
					text: window.location.href,
					width: 200,
					height: 200
				});
			}
		}
		if (!setup.failSafeInitisalisation) {
			this.initailisedNum = 1;
		}
	};

	p.slotInitReceived = function() {
		console.log('slotInitReceived', this.gameData);

		var preloader = new G.Preloader();
		preloader.init(this, this.SETUP_URL);
		preloader.setupComplete.add(this.onSetupLoaded, this);
		preloader.assetsLoaded.add(this.onAssetsLoadComplete, this);
		preloader.startLoad();

		this.preloaderEl = document.querySelector("#preloader");
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

		this.rescale();
		this.setupDisplay();
		this.initUIEvents();
		this.createProton();
	};


	/**
	 * Scales Application according to setup scale data
	 * STAGE_SCALE_MODE = "FULL ASPECT" || "FULL_BROWSER" || "NO_SCALE"
	 * any other value forces the app to not scale.
	 * @method rescale
	 */
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

		if (this.setup.scale && !this.setup.enableDesktopView) {
			this.STAGE_SCALE_MODE = this.setup.scale;
		}

		switch(this.STAGE_SCALE_MODE) {
			case "FULL_ASPECT" :
				stageScaleH = this.stageScale = stageScaleW = browserH / stageH;
				appWidth = Math.floor(stageW * stageScaleW);
				appHeight = Math.floor(stageH * stageScaleH);

				if (appWidth > browserW) {
					stageScaleW = this.stageScale = stageScaleH = browserW / stageW;
				}
				appLeft = Math.floor(browserW / 2 - appWidth /2);
				break;
			case "FULL_BROWSER" :
				stageScaleH = browserH / stageH;
				stageScaleW = browserW / stageW;
				appWidth = Math.floor(stageW * stageScaleW);
				appHeight = Math.floor(stageH * stageScaleH);
				this.stageScale = stageScaleW;
				break;
			case "NO_SCALE" :
				//defaults are fine
				break;
			default :

				break;
		}
		this.stage.scaleX = stageScaleW;
		this.stage.scaleY = stageScaleH;

		//No negative left cropping
		appLeft = appLeft < 0? 0 : appLeft;
		var styleWidth = appWidth.toString() + "px";
		var styleHeight = appHeight.toString() + "px";
		var styleLeft = appLeft.toString() + "px";
		//var preloaderCover = document.querySelector("#preloader");
		this.preloaderEl.style.width = styleWidth;
		this.preloaderEl.style.height = styleHeight;
		this.preloaderEl.style.left = styleLeft;

		var mainCanvas = document.querySelector("#app");
		mainCanvas.setAttribute("width", styleWidth );
		mainCanvas.setAttribute("height", styleHeight);
		mainCanvas.style.left = styleLeft;

		this.canvas = mainCanvas;

		G.Utils.currentScale = this.stageScale;

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
		var stageW = this.setup.stageW;
		var stageH = this.setup.stageH;
		//init background
		var spriteSheet = new createjs.SpriteSheet(this.assets.spriteSheetStatics);
		var sprite = new createjs.Sprite(spriteSheet, 'ui-bezel');
		console.log(this.setup.bezelW, this.setup.bezelH);
		this.stage.addChild(sprite);

		//stats
		this.stats.setMode(0); // 0: fps, 1: ms
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.bottom = '0px';
		this.stats.domElement.style.left = '0px';
		document.body.appendChild( this.stats.domElement );

		//init reels
		var reelsComponent = new G.ReelsComponent();

		reelsComponent.init(this.setup, this.signalDispatcher, this.serverInterface, spriteSheet);
		reelsComponent.drawReels();
		reelsComponent.x = bezelMarginL;
		reelsComponent.y = bezelMarginT;
		this.stage.addChild(reelsComponent);

		//store components
		this.reelsComponent = reelsComponent;
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
		symbolWinsComponent.cacheCompleted.add(this.checkCacheInitialised, this);
		symbolWinsComponent.x = bezelMarginL;
		symbolWinsComponent.y = bezelMarginT;
		this.stage.addChild(symbolWinsComponent);
		symbolWinsComponent.drawSprites();
		this.gameComponents.push(symbolWinsComponent);

		var bigWinComponent = new G.BigWinComponent();
		bigWinComponent.init(this.setup, this.signalDispatcher, this.assets.spriteSheetBigWin);
		bigWinComponent.cacheCompleted.add(this.checkCacheInitialised, this);
		bigWinComponent.x = bezelMarginL;
		bigWinComponent.y = bezelMarginT;
		this.stage.addChild(bigWinComponent);
		bigWinComponent.drawSprites();

		//init winLines
		var winLinesComponent = new G.WinLinesComponent();
		winLinesComponent.init(this.setup, this.signalDispatcher);
		winLinesComponent.cacheCompleted.add(this.checkCacheInitialised, this);
		this.stage.addChild(winLinesComponent);
		winLinesComponent.drawComponent();
		this.gameComponents.push(reelsComponent, winLinesComponent, bigWinComponent);

		var meterComponent = new G.MeterComponent();
		meterComponent.init(this.setup, this.signalDispatcher);
		meterComponent.drawComponent();
		this.stage.addChild(meterComponent);
		this.gameComponents.push(meterComponent);

        // init Dj
        var djComponent = new G.Dj();
        djComponent.init(this.setup, this.signalDispatcher);
        // djComponent.nameDrop("doc");
        this.gameComponents.push(djComponent);

		var gaffMenu = new G.GaffMenuComponent(this.version);
		gaffMenu.init(this.setup, this.signalDispatcher);
		gaffMenu.drawMenu();
		this.stage.addChild(gaffMenu);
		gaffMenu.x = bezelMarginL + (bezelW / 2);
		gaffMenu.y = bezelMarginT + (bezelH / 2);
		this.gaffMenu = gaffMenu;

		this.particlesComponent = new G.ParticlesComponent();
		this.gameComponents.push(this.particlesComponent);
		this.gameComponents.push(gaffMenu);

		G.Utils.gameComponents = this.gameComponents;

		if (!this.setup.devMode) {
			reelsComponent.mask = sceneMask;
		}
	};

	/**
	 * When initialisedNum has reduced to 0, all game components requiring async initialisation and graphics caching has completed
	 * @method checkInitialised
	 */
	p.checkCacheInitialised = function() {
		console.log('checkCacheInitialised', this.initailisedNum);
		if (--this.initailisedNum === 0) {
			this.preloaderEl.style.display = "none";
		}
	};

	/**
	 * Render Tick which updates Stage and any profiling tool.
	 * @see  http://createjs.com/tutorials/Animation%20and%20Ticker
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

		createjs.Touch.enable(this.stage);

		window.document.onkeydown = function(e) {

			switch(e.keyCode) {
				//space //enter
				case 32:
                case 0:
                    e.preventDefault();
					self.reelsComponent.requestSpin();
					break;
				////shift+g
				case 71 :
					self.gaffMenu.show();
					break;
				case 70 :
					self.signalDispatcher.fireworkLaunched.dispatch();
					break;
			}
		};

		var myElement = document.querySelector('#app');
		var mc = new Hammer(myElement);
		mc.get('swipe').set({
			direction: Hammer.DIRECTION_DOWN,
			threshold: 1
		});

		mc.get('pinch').set({
			enable: true
		});

		mc.on('swipe', function() {
			self.reelsComponent.spinReels();
		});

		mc.on('pinchin', function() {
			self.gaffMenu.hide();
		});

		mc.on('pinchout', function() {
			self.gaffMenu.show();
		});

		if (!this.setup.domHelpers) {
			var domHelpers = document.querySelector(".dom-helpers");
			domHelpers.parentNode.removeChild(domHelpers);
		}
	};

	/**
	 * Initialise Proton particle system and pass the info to the particles
	 * @method createProton
	 */
	p.createProton = function() {

		this.renderer = new Proton.Renderer('easel', this.proton, this.stage);
		this.particlesComponent.init(this.setup, this.signalDispatcher, this.canvas, this.stageScale, this.proton, this.renderer);
	};

	/**
	 * Switch between 30 and 60fps
	 * @method fpsSwitch
	 */
	p.fpsSwitch = function() {
		console.log('fpsSwitched');

		var currentFrameRate = Math.round(createjs.Ticker.framerate);
		if (currentFrameRate <= 30) {
			createjs.Ticker.setFPS(60);
		} else {
			createjs.Ticker.setFPS(30);
		}
	};

	G.Game = Game;

})();