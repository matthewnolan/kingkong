/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	/**
	 * Preloader is responsible loading Setup and assets into the Game.
	 * These include sounds, spritesheets, and data in the form of json files
	 * It will then dispatch Signals (Events) back to the Game for notification and safe caching of assets.
	 * @class Preloader
	 * @constructor
	 */
	var Preloader = function() {};

	var p = Preloader.prototype;
	p.constructor = Preloader;

	/**
	 * @constant SETUP_URL - path of setup.json file relative to public root.
	 * @type {string}
	 */
	p.SETUP_URL = "assets/config/setup.json";
	p.game = null;
	p.setupLoader = null;
	p.assetsLoader = null;
	p.spriteSheetBigWin = null;
	p.spriteSheetStatics = null;
	p.spriteSheetSymbolAnims = null;
	p.setupComplete = new signals.Signal();
	p.assetsLoaded = new signals.Signal();

	/**
	 * init - store a reference to game, creates a LoadQueue for Setup, creates a LoadQueue for Assets
	 * Defines Event Handlers for LoadQueues
	 * @param game
	 * @todo only pass in Setup
	 */
	p.init = function(game) {
		this.game = game;

		this.setupLoader = new createjs.LoadQueue(true);
		this.setupLoader.on("fileload", this.handleSetupLoaded, this);

		this.assetsLoader = new createjs.LoadQueue(true);
		this.assetsLoader.on("error", this.handleAssetsError, this);
		this.assetsLoader.on("progress", this.handleAssetsProgress, this);
		this.assetsLoader.on("fileload", this.handleAssetsFile, this);
		this.assetsLoader.on("complete", this.handleAssetsLoaded, this);
		this.assetsLoader.installPlugin(createjs.Sound);

	};

	/**
	 * startLoad - starts loading setup.json file
	 */
	p.startLoad = function() {
		this.setupLoader.loadFile(this.SETUP_URL);
	};

	/**
	 * handleSetupLoaded - dispatches a Signal to Game then loads Game assets
	 * @param e
	 */
	p.handleSetupLoaded = function(e) {
		this.setupComplete.dispatch(e.result);
		this.loadGameAssets();
	};

	/**
	 * loadGameAssets - loads spritesheets defined in Setup
	 */
	p.loadGameAssets = function() {
		// this.assetsLoader.loadManifest(this.game.setup.imageDataManifest);
		this.assetsLoader.loadManifest(this.game.setup.spritesManifest);
		this.assetsLoader.loadManifest(this.game.setup.soundsManifest);
	};

	/**
	 * handleAssetsError - handle errors in asset loading phase gracefully
	 */
	p.handleAssetsError = function() { };

	/**
	 * handleAssetsProgress - handle loading of game assets
	 */
	p.handleAssetsProgress = function(e) {
		var el = document.querySelector("#loadPercentage");
		el.innerHTML = Math.round(e.progress * 100).toString() + "%";
	};

	/**
	 * handleAssetsFile - handle loading of game assets
	 */
	p.handleAssetsFile = function(e) {
		// console.log(e.item.src);
	};

	/**
	 * handleAssetsLoaded - dispatch a Signal to Game containing loaded Assets
	 */
	p.handleAssetsLoaded = function() {
		var self = this;
		var assets = {
			spriteSheetBigWin: this.assetsLoader.getResult('bigWinAnim'),
			spriteSheetStatics: this.assetsLoader.getResult('staticImages'),
			spriteSheetSymbolAnims: this.assetsLoader.getResult('symbolAnims')
		};

		var el = document.querySelector("#loadState");
		el.innerHTML = "Loaded";

		el = document.querySelector("#initializeState");
		el.innerHTML = "Initializing...";


		setTimeout(function(){
			self.assetsLoaded.dispatch(assets);

		}, 50);



	};

	G.Preloader = Preloader;

})();