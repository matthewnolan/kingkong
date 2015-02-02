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
		preloader.events.on("SETUP_LOADED", this.onSetupLoaded, this);
		preloader.events.on("LOAD_COMPLETE", this.onAssetsLoadComplete, this);
		preloader.startLoad();
	};

	p.setSetup = function(setup) {
		this.setup = setup;
	};

	p.onSetupLoaded = function() {
		console.log(this.setup.gameTitle, 'Setup Loaded');

	};

	p.onAssetsLoadComplete = function(e) {
		console.log('{Game} :: onAssetsLoadComplete', e.result);

		this.setupDisplay();

	};

	p.setupDisplay = function() {



	};

	G.Game = Game;

})();