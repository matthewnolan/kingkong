/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	/**
	 * Responsible for loading setup.json config file, then sound and graphic assets.
	 * These include, spritesheets, and data in the form of json files
	 * It will then dispatch signals back to the Game for notification and safe caching of assets.
	 * Currently uses PreloadJS - see http://createjs.com/Docs/PreloadJS/modules/PreloadJS.html
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
	 * The load queue which will load configuration files.
	 * Currently only loading the setup.json file, but any future configuration eg. language file could be added to this load queue.
	 *
	 * @property setupLoader
	 * @type {createjs.LoadQueue}
	 * @default null
	 */
	p.setupLoader = null;

	/**
	 * The load queue which will load game assets, like sounds, spritesheets and other images.
	 * Currently there seems to be some unexpected behaviour where spritesheet image file loading is completed after the assetLoader.complete event is fired,
	 * leading to premature application initiation.  This has been raised with the PreloadJS team and the issue can be followed here: https://github.com/CreateJS/PreloadJS/issues/129
	 * In the meantime we are separately loading the spritesheet.pngs via the loader to ensure they are loaded before our preloader element is removed.
	 * The drawback of this is that the spritesheet.pngs get preloaded AND loaded after the app is initialised.  Although the 2nd load will likely be from cache.
	 *
	 * @property assetsLoader
	 * @type {createjs.LoadQueue}
	 * @default null
	 */
	p.assetsLoader = null;

	/**
	 * When the setupLoader complete event is fired, this signal is dispatched notifying the Game.
	 *
	 * @property setupComplete
	 * @type {Signal}
	 */
	p.setupComplete = new signals.Signal();

	/**
	 * When the assetsLoader complete event is fired, this signal is dispatched notifying the Game, and loaded assets passed with it.
	 *
	 * @property assetsLoaded
	 * @type {Signal}
	 */
	p.assetsLoaded = new signals.Signal();

	/**
	 * The loaded config file (setup.json).
	 *
	 * @property setup
	 * @type {Object}
	 */
	p.setup = null;

	/**
	 * The HTML element displaying preloader information
	 *
	 * @property progressEl
	 * @type {HTMLElement}
	 */
	p.progressEl = null;

	/**
	 * Preloader initialisation sets up the following:
	 *
	 * - Set up LoadQueue for loading config file (setup.json).
	 * - Set up LoadQueue for loading game assets (sounds, spritesheets more jsons)
	 * - Set up EventHandlers to listen for LoadQueue events.
	 * - Install the SoundJS Plugin
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

		this.progressEl = document.querySelector("#loadPercentage");
	};

	/**
	 * Starts the setupLoader load queue.
	 *
	 * @method startLoad
	 */
	p.startLoad = function() {
		this.setupLoader.loadFile(this.SETUP_URL);
	};

	/**
	 * dispatches a Signal to Game passes the setup file then loads Game assets
	 *
	 * @method handleSetupLoaded
	 * @param {createjs.Event} e - the load complete event
	 */
	p.handleSetupLoaded = function(e) {
		this.setup = e.result;
		this.setupComplete.dispatch(this.setup);
		this.loadGameAssets();
	};

	/**
	 * loads spritesheets, images and sounds manifests defined in Setup
	 *
	 * @method loadGameAssets
	 */
	p.loadGameAssets = function() {
		// this.assetsLoader.loadManifest(this.setup.imageDataManifest, false);
		this.assetsLoader.loadManifest(this.setup.spritesManifest, false);
		if (this.setup.loadSounds) {
			this.assetsLoader.loadManifest(this.setup.soundsManifest, false);
		}
		this.assetsLoader.load();
	};

	/**
	 * handle errors in asset loading phase gracefully
	 * @method handleAssetsError
	 * @param {createjs.Event} e - The error event.
	 * @todo display a reasonable error message to the user
	 */
	p.handleAssetsError = function(e) {
		alert("Error loading game assets\n" + e.message);
	};

	/**
	 * handle progress of game assets
	 *
	 * @method handleAssetsProgress -
	 * @param {createjs.Event} e - The progress event
	 */
	p.handleAssetsProgress = function(e) {
		console.log("loading", e.progress, e.loaded, e.total);
		if (e.loaded <= 1) {
			this.progressEl.innerHTML = Math.floor(e.progress * 100).toString() + "%";
		}
	};

	/**
	 * debug loading of game assets
	 *
	 * @method handleAssetsFile
	 * @param {createjs.Event} e - the file load event
	 */
	p.handleAssetsFile = function() { };

	/**
	 * All game assets have completed loading, now update visible load state information
	 * and dispatch a Signal to game and pass assets.
	 * This is done on a setTimeout to prevent a bug probably related to too much strain on the cpu
	 *
	 * @method handleAssetsLoaded
	 */
	p.handleAssetsLoaded = function(e) {
		console.log('handleAssetsLoaded', e);
		var assets = {
			spriteSheetBigWin: this.assetsLoader.getResult('bigWinAnim'),
			spriteSheetBigWinAnimSymbol: this.assetsLoader.getResult('bigWinAnimSymbol'),
			spriteSheetStatics: this.assetsLoader.getResult('staticImages'),
			spriteSheetSymbolAnims: this.assetsLoader.getResult('symbolAnims')
		};

		var el = document.querySelector("#loadState");
		el.innerHTML = "Loaded";
		el = document.querySelector("#initializeState");
		el.innerHTML = "Initializing...";

		G.Utils.callLater(this.assetsLoaded.dispatch, [assets], this, 50);
	};

	G.Preloader = Preloader;

})();