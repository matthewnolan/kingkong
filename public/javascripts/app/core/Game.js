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
		this.signalDispatcher = new G.SignalDispatcher();
		this.setupDisplay();
		this.initUIEvents();
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

		//init winLines
		var winLinesComponet = new G.WinLinesComponent();
		winLinesComponet.init(this.setup, this.signalDispatcher);
		this.stage.addChild(winLinesComponet);
		winLinesComponet.drawComponent();

		//store components
		this.components.reels = reelsComponent;
		this.components.winLines = winLinesComponet;
		this.gameComponents.push(reelsComponent, winLinesComponet);
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
		//symbolWinsComponent.drawDebug();
		//symbolWinsComponent.runUnifiedSprites();
		this.components.symbolWins = symbolWinsComponent;
		this.gameComponents.push(symbolWinsComponent);

		var bigWinComponent = new G.BigWinComponent();
		bigWinComponent.init(this.setup, this.signalDispatcher, this.assets.spriteSheetBigWin);
		bigWinComponent.x = bezelMarginL;
		bigWinComponent.y = bezelMarginT;
		this.stage.addChild(bigWinComponent);
		bigWinComponent.drawSprites();


		this.components.bigWin = bigWinComponent;
		this.gameComponents.push(bigWinComponent);

		var gaffMenu = new G.GaffMenuComponent(this.version);
		gaffMenu.init(this.setup, this.signalDispatcher);
		gaffMenu.drawMenu();
		this.stage.addChild(gaffMenu);
		gaffMenu.x = bezelMarginL + (bezelW / 2);
		gaffMenu.y = bezelMarginT + (bezelH / 2);
		//gaffMenu.x = 185;
		//gaffMenu.y = 348;



		console.log('gaff', gaffMenu.x, gaffMenu.y);

		this.components.gaff = gaffMenu;
		this.gameComponents.push(gaffMenu);


		if (!this.setup.devMode) {
			reelsComponent.mask = sceneMask;
		}
	};

	/**
	 * User Control is initialised: Keyboard control / touch controls
	 * if User Control shouldn't be enabled during app initialisation phase, then execute this function later.
	 * @todo - configure a way to turn on/off user interaction events.
	 * @method initUIEvents
	 */
	p.initUIEvents = function() {

		var self = this;
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
			self.components.gaff.show();
		});

		mc.on('pinchout', function() {
			self.components.gaff.hide();
		});

		if (!this.setup.domHelpers) {
			//$('.dom-helpers').remove();

			var domHelpers = document.querySelector(".dom-helpers");
			domHelpers.parentNode.removeChild(domHelpers);
		}

	};


	G.Game = Game;

})();