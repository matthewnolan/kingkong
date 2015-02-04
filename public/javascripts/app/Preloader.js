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
	p.preloadSetup = null;
	p.preloadAssets = null;

	p.setupComplete = new signals.Signal();
	p.assetsLoaded = new signals.Signal();

	/**
	 "spritesManifest" : [
	 {"src": "assets/sprites/bigwin_1.json", "id": "bigWinAnim"},
	 {"src": "assets/sprites/static-images.json", "id": "staticImages"},
	 {"src": "assets/sprites/symbol_anims.json", "id": "symbolAnims"}
	 ],
	 * @param game
	 * @param setupUrl
	 */
	p.spriteSheetBigWin = null;
	p.spriteSheetStatics = null;
	p.spriteSheetSymbolAnims = null;

	p.init = function(game, setupUrl) {
		console.log(this, 'init');

		this.game = game;
		this.setupUrl = setupUrl;

		this.preloadSetup = new createjs.LoadQueue(true);
		this.preloadSetup.on("fileload", this.handleSetupLoaded, this);

		this.preloadAssets = new createjs.LoadQueue(true);
		this.preloadAssets.on("error", this.handleAssetsError, this);
		this.preloadAssets.on("progress", this.handleAssetsProgress, this);
		this.preloadAssets.on("complete", this.handleAssetsComplete, this);
	};

	p.startLoad = function() {
		console.log('{Preload} startLoad');

		this.preloadSetup.loadFile(this.SETUP_URL);
	};

	p.handleSetupLoaded = function(event) {
		console.log('handle setup loaded', this, event.result);

		this.setupComplete.dispatch(event.result);
		this.loadGameAssets();
	};

	p.loadGameAssets = function() {
		console.log('loadGameAssets', this.game.setup.spritesManifest);
		this.preloadAssets.loadManifest(this.game.setup.spritesManifest);
	};

	p.handleAssetsError = function(e) {
		console.warn('{Preloader} handleAssetsError', e);
	};

	p.handleAssetsProgress = function(e) {
		console.info('{Preloader} handleAssetsProgress', e);
	};

	p.handleAssetsComplete = function(e) {
		console.log('{Preloader} handleAssetsComplete', e);
		//this.events.dispatchEvent(new createjs.Event("LOAD_COMPLETE"));

		var assets = {
			spriteSheetBigWin: this.preloadAssets.getResult('bigWinAnim'),
			spriteSheetStatics: this.preloadAssets.getResult('staticImages'),
			spriteSheetSymbolAnims: this.preloadAssets.getResult('symbolAnims')
		};

		this.assetsLoaded.dispatch(assets);
	};

	G.Preloader = Preloader;

})();