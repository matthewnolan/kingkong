/*! kingkong 0.0.1 - 2015-02-03
* Copyright (c) 2015 Licensed @HighFiveGames */
/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	var Game = function() {};
	var p = Game.prototype;
	p.constructor = Game;

	p.setup = null;

	p.serverInterface = null;

	p.SETUP_URL = 'assets/config/setup.json';

	p.stage = null;

	p.init = function(stage, serverInterface) {
		this.serverInterface = serverInterface;

		var preloader = new G.Preloader();
		preloader.init(this, this.SETUP_URL);
		preloader.events.on("SETUP_LOADED", this.onSetupLoaded, this, true);
		preloader.events.on("LOAD_COMPLETE", this.onAssetsLoadComplete, this);
		preloader.startLoad();
	};


	p.onSetupLoaded = function(e, data) {
		console.log('onSetupLoaded', e, 'data=', data);

	};

	p.onAssetsLoadComplete = function(e) {
		console.log('{Game} :: onAssetsLoadComplete', e.result);

		this.setupDisplay();

	};

	p.setupDisplay = function() {



	};

	G.Game = Game;

})();
/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	var Main = function() {};
	var p = Main.prototype;
	p.constructor = Main;

	p.stats = null;

	p.stage = null;

	/**
	 * init
	 * Application Entry Point
	 */
	p.init = function() {

		this.stats = new Stats();
		this.stats.setMode(0); // 0: fps, 1: ms
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.bottom = '0px';
		this.stats.domElement.style.left = '0px';
		document.body.appendChild( this.stats.domElement );

		this.stage = new createjs.Stage("app");

		createjs.Ticker.on("tick", this.handleTick, this);
		createjs.Ticker.setFPS(60);

		window.addEventListener('load', function() {
			console.log('Window Loaded');
			setTimeout(function() {
				window.scrollTo(0, 1);
			}, 0);
		}, false);

		var serverInterface = new G.ServerInterface();
		serverInterface.init();

		var game = new G.Game();
		game.init(this.stage, serverInterface);

	};

	p.handleTick = function() {
		this.stats.begin();
		this.stage.update();
		this.stats.end();
	};


	G.Main = Main;

})();
/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	var Preloader = function() {};

	var p = Preloader.prototype;
	p.constructor = Preloader;

	p.game = null;

	p.preloadSetup = null;

	p.setupUrl = "";

	p.preloadAssets = null;

	p.setupComplete = new signals.Signal();

	p.init = function(game, setupUrl) {
		console.log(this, 'init');
		this.game = game;
		this.setupUrl = setupUrl;

		this.preloadSetup = new createjs.LoadQueue();
		this.preloadSetup.on("fileload", this.handleSetupLoaded, this);

		this.preloadAssets = new createjs.LoadQueue();
		this.preloadAssets.on("error", this.handleAssetsError);
		this.preloadAssets.on("progress", this.handleAssetsProgress);
		this.preloadAssets.on("comlete", this.handleAssetsComplete);
	};

	p.startLoad = function() {
		console.log('{Preload} startLoad');
		this.preloadSetup.loadFile(this.setupUrl);
	};

	p.handleSetupLoaded = function(event) {
		console.log('handle setup loaded', this, event.result);
		//this.game.setSetup(event.result);
		this.events.dispatchEvent(new createjs.Event("SETUP_LOADED"), event.result);
		this.loadGameAssets();
	};

	p.loadGameAssets = function() {
		//this.preloadAssets.loadFile(this.game.setup.mainUiBezel);
		//this.game.setup.reelSymbols
	};

	p.handleAssetsError = function() {

	};

	p.handleAssetsProgress = function() {

	};

	p.handleAssetsComplete = function() {
		this.events.dispatchEvent(new createjs.Event("LOAD_COMPLETE"));
	};

	G.Preloader = Preloader;

})();
/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	var ServerInterface = function() {};
	var p = ServerInterface.prototype;
	p.constructor = ServerInterface;


	p.init = function() { 

	};

	G.ServerInterface = ServerInterface;

})();