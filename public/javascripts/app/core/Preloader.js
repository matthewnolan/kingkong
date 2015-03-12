/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	/**
	 * Responsible for loading setup.json config file, then sound and graphic assets.
	 * These include, spritesheets, and data in the form of json files
	 * It will then dispatch signals back to the Game for notification and safe caching of assets.
	 *
	 * @class Preloader
	 * @constructor
	 * @uses createjs.LoadQueue - PreloadJS framework for loading externally stored assets. see
	 */
	var Preloader = function() {};

	var p = Preloader.prototype;
	p.constructor = Preloader;

	/**
	 * URL location where the Preloader can find the config file (setup.json)
	 *
	 * @constant SETUP_URL - path of setup.json file relative to public root.
	 * @type {string}
	 * @default "assets/config/setup.json"
	 */
	p.SETUP_URL = "assets/config/setup.json";

	/**
	 *
	 *
	 * setupLoader
	 *
	 * @property setupLoader
	 * @type {null}
	 */
	p.setupLoader = null;
	p.assetsLoader = null;

	p.setupComplete = new signals.Signal();
	p.assetsLoaded = new signals.Signal();

	/**
	 * The loaded config file (setup.json).
	 *
	 * @property setup
	 * @type {Object}
	 */
	p.setup = null;

	/**
	 * - Set up LoadQueue for loading config file (setup.json).
	 * - Set up LoadQueue for loading game assets (sounds, spritesheets more jsons)
	 * - Set up EventHandlers to listen for LoadQueue events.
	 * - Install the SoundJS Plugin
	 *
	 * @param {G.Game} game - game is passed in, Preloader will reference
	 */
	p.init = function() {
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
	 * @
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
		this.setup = e.result;
		this.setupComplete.dispatch(this.setup);
		this.loadGameAssets();
	};

	/**
	 * loadGameAssets - loads spritesheets defined in Setup
	 */
	p.loadGameAssets = function() {
		this.assetsLoader.loadManifest(this.setup.imageDataManifest);
		this.assetsLoader.loadManifest(this.setup.spritesManifest);
		this.assetsLoader.loadManifest(this.setup.soundsManifest);
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