/*! kingkong 0.0.1 - 2015-02-02
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

	p.init = function(serverInterface) {
		this.serverInterface = serverInterface;

	};

	p.setSetup = function(setup) {
		this.setup = setup;

		console.log(this.setup.gameTitle, 'Setup Loaded');
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

	p.SETUP_URL = 'assets/config/setup.json';

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
		game.init(serverInterface);

		var preloader = new G.Preloader();
		preloader.init(game, this.SETUP_URL);
		preloader.startLoad();


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

	p.init = function(game, setupUrl) {
		console.log(this, 'init');
		this.game = game;
		this.setupUrl = setupUrl;

		this.preloadSetup = new createjs.LoadQueue();
		this.preloadSetup.on("fileload", this.handleSetupLoaded, this);
	};

	p.startLoad = function() {
		this.preloadSetup.loadFile(this.setupUrl);
	};

	p.handleSetupLoaded = function(event) {
		console.log('handle setup loaded', this, event.result);
		this.game.setSetup(event.result);
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