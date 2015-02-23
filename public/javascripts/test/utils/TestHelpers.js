/*! kingkong 0.0.1 - 2015-02-02
 * Copyright (c) 2015 Licensed @HighFiveGames */

this.TestHelpers = this.TestHelpers || {};

(function () {
	"use strict";

	/**
	 * TestHelpers
	 * @class TestHelpers
	 * @constructor
	 */
	var Preloader = function() {};

	var p = Preloader.prototype;
	p.constructor = Preloader;

	p.assetsLoader = null;
	p.spriteSheetSymbolAnims = null;
	p.assetsLoaded = new signals.Signal();

	/**
	 * init - store a reference to game, creates a LoadQueue for Setup, creates a LoadQueue for Assets
	 * Defines Event Handlers for LoadQueues
	 * @todo only pass in Setup
	 */
	p.init = function() {
		this.assetsLoader = new createjs.LoadQueue(true);
		this.assetsLoader.on("error", this.handleAssetsError, this);
		this.assetsLoader.on("progress", this.handleAssetsProgress, this);
		this.assetsLoader.on("complete", this.handleAssetsLoaded, this);
		this.assetsLoader.loadManifest(
			[
				{"src": "assets/sprites/symbol_anims.json", "id": "symbolAnims"}
			]
		);
	};

	/**
	 * handleAssetsError - handle errors in asset loading phase gracefully
	 */
	p.handleAssetsError = function() {
		console.warn("aset load error")
	};

	/**
	 * handleAssetsProgress - handle loading of game assets
	 */
	p.handleAssetsProgress = function(e) { };

	/**
	 * handleAssetsLoaded - dispatch a Signal to Game containing loaded Assets
	 */
	p.handleAssetsLoaded = function() {
		var self = this;
		var assets = {
			spriteSheetSymbolAnims: this.assetsLoader.getResult('symbolAnims')
		};

		this.spriteSheetSymbolAnims = assets.spriteSheetSymbolAnims;

		setTimeout(function(){
			self.assetsLoaded.dispatch(assets);
		}, 50);


	};

	TestHelpers.Preloader = Preloader;

})();