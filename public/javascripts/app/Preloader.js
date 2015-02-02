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

	p.events = new createjs.EventDispatcher();

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
		this.game.setSetup(event.result);
		this.events.dispatchEvent(new createjs.Event("SETUP_LOADED"));
		this.loadGameAssets();
	};

	p.loadGameAssets = function() {
		this.preloadAssets.loadFile(this.game.setup.mainUiBezel);
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