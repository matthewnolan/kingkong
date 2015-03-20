/*! kingkong 0.0.1 - 2015-02-02
 * Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	/**
	 * Game is the root of the application.  It creates everything a king kong game needs in order to run.  And is responsible for initialising
	 * Preloading, SignalDispatcher, Server connection, GameData, GameComponents and the Display.  Scaling and UserInterface Events are also handled here.
	 * It also provides some dependency injection to the Games Components, which becomes the core method GameComponents use to talk to each other.
	 *
	 * Responsibilities explained:
	 *
	 * Preloading: Creates and initialises a G.Preloader which goes and fetches required sound and graphic assets.
	 *
	 * Server: Creates and initialises a G.ServerInterface which can talk to the server. (Currently the Node server for development purposes).
	 *
	 * Signals: We use signalsjs to handle communications around the application.  Signals are test friendly, and robust event dispatching system which don't rely on
	 * "magic" strings to work.  They also support custom parameters, which gets rid of the need to create custom event classes.
	 * We use a signalDispatcher object passed into GameComponents to handle communication between different components.
	 *
	 * GameComponents: The app contains a number of gameComponents.  A GameComponent is a createjs.Container, a DisplayObject which may be added to the canvas.
	 * They may also contains some game logic, for example: the reels must be displayed according the margin values passed in via the setup.json.
	 * Also, a reel may animate and dispatch an event(signal) when completed.
	 * For this reason all GameComponents are passed references to the setup.j	son and a SignalDispatcher.
	 * All GameComponents are also added to the static G.Utils.gameComponents array, which gives the application the freedom to call up gameComponents at any time when
	 * required without necessarily having to use the signalDispatcher.
	 *
	 * GameData: Creates and initialises a G.GameData.  When data is returned from the server, it uses GameData to store the returned responses and notify the signalDispatcher
	 * that data has returned.

	 * Stage and Ticker: Stage and Ticker are createjs concepts.  Stage is the root display object of the Canvas, and is the container where all createjs display objects
	 * must be added to.  Ticker is responsible for updating the stage at regular intervals.  We currently sync stage updates with requestAnimationFrame
	 * in order to ensure that animations are as smooth as possible on newer browsers which support requestAnimationFrame.
	 * It is recommened to read this to understand more: http://createjs.com/tutorials/Animation%20and%20Ticker/
	 *
	 * See more info at: http://createjs.com/Home
	 *
	 * Proton: Is particle animation system used by this application - It was chosen because it supports createjs and other rendering engines.
	 * It also performed very well in tests. It is created here in Game because it is required to be updated during the createjs.Ticker cycle.
	 *
	 * See more info at:  https://github.com/a-jie/Proton
	 *
	 * Scaling: In order to support multiple screen resolutions, the application is created at a native scale size of 667px x 375px.
	 * This value should be set as the setup.json's "scale" value.
	 * The application supports multiple scale modes to help support as many device sizes as possible:
	 * 	"FULL_ASPECT":
	 * 		This scales the application up or down to fit into the the devices viewport while maintaining aspect ratio.  Viewport is the window size, and iframe or WebView container size should be respected.
	 * 	"FULL_BROWSER":
	 * 		This scales the application up or down to fit into the viewport dimensions precisely.  This will cause stretching on devices that don't match the native aspect
	 * 		ratio.
	 * 	"NONE" or any other value:
	* 		No scaling is performed, and the application is created at the native dimensions.
	 *
	 *
	 * Devices:
	 * This application is designed to play on multiple devices, browsers and screen resolutions.  Having said this, it is not possible to design
	 * an application which can run on any browser on any device and on any screen size. There are limitations and these should be considered.
	 * @todo create a device compatiibility matrix
	 *
	 * @class Game
	 * @constructor
	 */
	var Game = function() {};
	var p = Game.prototype;
	p.constructor = Game;

	/**
	 * Decides what scale mode is used to determine the scale and position of the canvas
	 * this value is overridden by whatever value is inside setup.json 'scale'
	 *
 	 * @Property STAGE_SCALE_MODE
	 * @type {string}
	 * @example "NO_SCALE" - uses the default setup.json stageScale value;
	 * @example "FULL_BROWSER" - stretches the app to the viewport size;
	 * @default 'FULL_ASPECT - scales the app to the viewport, maintining aspect ratio'
	 */
	p.STAGE_SCALE_MODE = "FULL_ASPECT";

	/**
	 * Displayed in gaffMenu - version is injected by the build process.
	 *
	 * @property version
	 * @type {string}
	 * @default "{{ VERSION }}"
	 * @example "1.2.2" if minified
	 */
	p.version = "{{ VERSION }}";

	/**
	 * This is the main setup file for the application.  Many properties and features in the app can be enabled / disabled via this configuration.
	 * The first thing Game does is look for the setup.json in the default directory and try to load it.  Once loaded it sets this property from the loaded
	 * json object.
	 *

	 * @property setup
	 * @type {Object}
	 * @see /assets/config/setup.json
	 * @default null
	 */
	p.setup = null;

	/**
	 * This is created during init and talks to the server.  It is used by GameComponents to make requests to the server.
	 * Responses are delivered to the GameComponents via signalDispatcher.
	 *
	 * @property serverInterface
	 * @type {G.ServerInterface}
	 * @default null
	 */
	p.serverInterface = null;

	/**
	 * This is created during init and passed around the application to GameComponents, or any part of the application that requires to talk or listen to another part.
	 * Signals created on this object can be dispatched and handled by any class which has this reference.
	 *
	 * @property signalDispatcher
	 * @type {G.SignalDispatcher}
	 * @default null
	 */
	p.signalDispatcher = null;

	/**
	 * The maxFps the app will try to achieve.  This is not the guaranteed FPS in your device.  This value can be switched via Gaff.
	 * @property currentMaxFps
	 * @type {number}
	 * @default 60
	 */
	p.currentMaxFps = 60;

	/**
	 * Object contains references to assets loaded via preloader.
	 * This can then be used to pass to GameComponents which require loaded assets.
	 *
	 * @property assets
	 * @type {Object}
	 * @default null
	 */
	p.assets = null;

	/**
	 * An array container for all GameComponents.  Passed to the static G.Utils for easy access.
	 *
	 * @property gameComponents
	 * @type {G.GameComponent[]}
	 * @default []
	 */
	p.gameComponents = [];

	/**
	 * GameComponent responsible for running particle animations.
	 *
	 * @property particlesComponent
	 * @type {G.ParticlesComponent}
	 * @default null
	 */
	p.particlesComponent = null;

	/**
	 * GameComponent responsible for drawing and animating the Reels.
	 *
	 * @property reelsComponent
	 * @type {G.ReelsComponent}
	 * @default null
	 */
	p.reelsComponent = null;

	/**
	 * GameComponent responsible for drawing and the logic inside the gaffMenu
	 *
	 * @property reelsComponent
	 * @type {G.GaffMenuComponent}
	 * @default null
	 */
	p.gaffMenu = null;

	/**
	 * GameData stores data returned from the server via ServerInterface requests
	 * It can dispatch signalDispatcher signals to notify GameComponents some serverResponse has happened.
	 * @property gameData
	 * @type {G.GameData}
	 * @default null
	 */
	p.gameData = null;

	/**
	 * The Proton object used by tha animation system and updated by Ticker stage updates.
	 *
	 * @property proton
	 * @type {Proton}
	 * @default null
	 */
	p.proton = null;

	/**
	 * Cache the createjs.Stage object for stage updates
	 *
	 * @property stage
	 * @type {createjs.Stage}
	 * @default null
	 */
	p.stage = null;

	/**
	 * Default stageScale value. If defined in setup.json this value is overridden
	 *
	 * @property stageScale
	 * @type {number}
	 * @default 1
	 */
	p.stageScale = 1;

	/**
	 * Number of initialised game components to check have initialised before loader is removed.  If the setup.json defines
	 * failSafeDelay then it waits for Reels, WinLines and BigWin Animation to play before it removes the preloader
	 *
	 * @property initialisedNum
	 * @type {number}
	 * @default 3
	 *
	 */
	p.initailisedNum = 3;

	/**
	 * Caches the preloader HTML element which covers the app during loading and initialisation
	 *
	 * @property preloaderEl
	 * @type {HTMLElement}
	 * @default null
	 */
	p.preloaderEl = null;

	/**
	 * Cache HTML Canvas Element for scaling
	 *
	 * @property canvas
	 * @type {HTMLElement}
	 * @default null
	 */
	p.canvas = null;

	/**
	 * Game entry point
	 *
	 * Creates and initialises Game framework classes in this order:
	 * 1. Stats (for profiling)
	 * 2. SignalDispatcher
	 * 3. GameData
	 * 4. ServerInterface
	 * 5. Stage
	 * 6. Proton
	 *
	 * Game initialisation is continued when the ServerInterface returns SlotInitResponse
	 *
	 * @method init:
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
	};

	/**
	 * When Slot Init is Received, then Preloader is created and setup.json begins loading
	 * App then waits for assetsLoadComplete signal to be dispatched by preloader.
	 * Preloader element is cached so it can be removed later.
	 *
	 * @method slotInitReceived
	 */
	p.slotInitReceived = function() {
		var preloader = new G.Preloader();
		preloader.init(this, this.SETUP_URL);
		preloader.setupComplete.add(this.onSetupLoaded, this);
		preloader.assetsLoaded.add(this.onAssetsLoadComplete, this);
		preloader.startLoad();

		this.preloaderEl = document.querySelector("#preloader");
	};


	/**
	 * SignalHandler which caches setup.json object when it has finished loading.
	 *
	 * @method onSetupLoaded
	 * @param {Object} setup - Setup Object which is loaded from setup.json file
	 *
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

	/**
	 * Signal Handler called when assetsLoadComplete is dispatched by preloader.
	 * Assets are cached and the application continues to initialisation phase.
	 * 1. Rescale the application according the setup.json config,
	 * 2. Setup the main display, creates GameComponents and adds them to the stage.
	 * 3. Proton animation system is created.
	 *
	 * @method onAssetsLoadComplete
	 * @param {Object} assets - the preloaded game assets which are cached and passed to GameComponents which need it.
	 *
	 */
	p.onAssetsLoadComplete = function(assets) {
		this.assets = assets;

		this.rescale();
		this.setupDisplay();
		this.initUIEvents();
		this.createProton();
	};


	/**
	 * Scales Application according to setup.json scaling configuration
	 *
	 * AVAILABLE STAGE_SCALE_MODE = "FULL ASPECT" || "FULL_BROWSER" || "NO_SCALE" or ANY OTHER VALUE
	 * "FULL_ASPECT" - scale the application to the visible window size, whilst maintaining the app's native apsect ratio.  This will display black borders
	 * When a device apsect ratio doesn't match the app.
	 * "FULL_BROWSER" - scale the application to fit the entire window size, stretching the graphics is the aspect ratios do not match.
	 * "NO_SCALE" - do not scale the application at all.
	 *
	 * If the setup.json's enableDesktopView is turned on, the app is set automatically to not scale.
	 * Stores the final scale value inside G.Utils, for access anywhere in the application.
	 *
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
	 * Initialise and create GaemComponents and add them to thd display.
	 * GameComponents are stored inside the static G.Utils.gameComponents for access anywhere in the application.
	 * Adds stats to the window for profiling
	 * Masks the reels inside the bezel area.
	 *
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
		// console.log(this.setup.bezelW, this.setup.bezelH);
		this.stage.addChild(sprite);

		//stats
		this.stats.setMode(0); // 0: fps, 1: ms
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.bottom = '0px';
		this.stats.domElement.style.left = '0px';
		document.body.appendChild( this.stats.domElement );

		//init reels
		var reelsComponent = new G.ReelsComponent();
		reelsComponent.init(this.setup, this.signalDispatcher, this.serverInterface, spriteSheet, this.gameData.slotInitVO.reelStrips);
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
	 * This function is called everytime a GameComponent with caching enabled has finished rendering.
	 * When initialisedNum has reduced to 0, all game components requiring async initialisation and graphics caching has completed
	 * and the preloader element is removed from the dom.
	 *
	 * @method checkInitialised
	 */
	p.checkCacheInitialised = function() {
		if (--this.initailisedNum === 0) {
			this.preloaderEl.style.display = "none";
		}
	};

	/**
	 * Render Tick which updates Stage and any profiling tool.
	 *
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
	 * Initialise Proton particle system and pass the info to the particles GameComponent
	 *
	 * @method createProton
	 */
	p.createProton = function() {

		this.renderer = new Proton.Renderer('easel', this.proton, this.stage);
		this.particlesComponent.init(this.setup, this.signalDispatcher, this.canvas, this.stageScale, this.proton, this.renderer);
	};

	/**
	 * Switch between 30 and 60fps via the gaff menu button labelled "60" or "30"
	 *
	 * @method fpsSwitch
	 */
	p.fpsSwitch = function() {
		console.log('fpsSwitched');

		if (this.currentMaxFps === 60) {
			this.currentMaxFps = 30;
		} else {
			this.currentMaxFps = 60;
		}
		createjs.Ticker.setFPS(this.currentMaxFps);
	};

	G.Game = Game;

})();