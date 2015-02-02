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