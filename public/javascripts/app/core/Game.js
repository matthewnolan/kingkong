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
	 * init: Game entry point, create Preloader and accept a Display root (currently createjs.stage), and ServerInterface.
	 * Starts Preloading of assets
	 * @param {createjs.Stage} stage - The root Display Container which is added to Canvas
	 * @param {ServerInterface} serverInterface - Interface for incoming and outgoing server requests
	 */
	p.init = function(stage, serverInterface) {
		this.serverInterface = serverInterface;
		this.stage = stage;

		this.signalDispatcher = new G.SignalDispatcher();

		var preloader = new G.Preloader();
		preloader.init(this, this.SETUP_URL);
		preloader.setupComplete.add(this.onSetupLoaded, this);
		preloader.assetsLoaded.add(this.onAssetsLoadComplete, this);
		preloader.startLoad();
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
	};

	p.rescale = function() {
		var stageW = this.setup.stageW || 667;
		var stageH = this.setup.stageH || 375;
		var browserW = window.innerWidth;
		var browserH = window.innerHeight;
		var stageScale = this.setup.stageScale || 1;
		var stageScaleW = stageScale, stageScaleH = stageScale;
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

		this.stage.scaleX = stageScaleW;
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

		this.displayInitialised.dispatch();
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


	G.Game = Game;

})();