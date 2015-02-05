/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	var Preloader = function() {};

	var p = Preloader.prototype;
	p.constructor = Preloader;

	p.SETUP_URL = "assets/config/setup.json";
	p.game = null;
	p.setupLoader = null;
	p.assetsLoader = null;
	p.spriteSheetBigWin = null;
	p.spriteSheetStatics = null;
	p.spriteSheetSymbolAnims = null;

	p.setupComplete = new signals.Signal();
	p.assetsLoaded = new signals.Signal();

	p.init = function(game) {
		//console.log(this, 'init');

		this.game = game;

		this.setupLoader = new createjs.LoadQueue(true);
		this.setupLoader.on("fileload", this.handleSetupLoaded, this);

		this.assetsLoader = new createjs.LoadQueue(true);
		this.assetsLoader.on("error", this.handleAssetsError, this);
		this.assetsLoader.on("progress", this.handleAssetsProgress, this);
		this.assetsLoader.on("complete", this.handleAssetsLoaded, this);
	};

	p.startLoad = function() {
		console.log('{Preload} startLoad');

		this.setupLoader.loadFile(this.SETUP_URL);
	};

	p.handleSetupLoaded = function(event) {
		console.log('handle setup loaded', this, event.result);

		this.setupComplete.dispatch(event.result);
		this.loadGameAssets();
	};

	p.loadGameAssets = function() {
		//console.log('loadGameAssets', this.game.setup.spritesManifest);
		this.assetsLoader.loadManifest(this.game.setup.spritesManifest);
	};

	p.handleAssetsError = function(e) { };

	p.handleAssetsProgress = function(e) { };

	p.handleAssetsLoaded = function(e) {
		var assets = {
			spriteSheetBigWin: this.assetsLoader.getResult('bigWinAnim'),
			spriteSheetStatics: this.assetsLoader.getResult('staticImages'),
			spriteSheetSymbolAnims: this.assetsLoader.getResult('symbolAnims')
		};

		this.assetsLoaded.dispatch(assets);
	};

	G.Preloader = Preloader;

})();