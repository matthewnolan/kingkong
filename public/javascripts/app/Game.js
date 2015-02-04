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

	p.stage = null;

	p.assets = {};

	p.init = function(stage, serverInterface) {
		this.serverInterface = serverInterface;
		this.stage = stage;



		console.log('window.document', window.document);

		var preloader = new G.Preloader();
		preloader.init(this, this.SETUP_URL);
		preloader.setupComplete.add(this.onSetupLoaded, this);
		preloader.assetsLoaded.add(this.onAssetsLoadComplete, this);
		preloader.startLoad();
	};


	/**
	 * Signal Handler onSetupLoaded
	 * @param data
	 */
	p.onSetupLoaded = function(data) {
		console.log('onSetupLoaded data=', data);
		this.setup = data;
	};

	/**
	 * Signal Handler onSetupLoadComplete
	 */
	p.onAssetsLoadComplete = function(assets) {
		console.log('{Game} :: onAssetsLoadComplete', this);
		this.assets = assets;
		this.setupDisplay();
	};

	p.setupDisplay = function() {
		var bezelMarginL = this.setup.bezelMarginL;
		var bezelMarginT = this.setup.bezelMarginT;
		var bezelW = this.setup.bezelW;
		var bezelH = this.setup.bezelH;

		var bgLayer = new createjs.Container();
		this.stage.addChild(bgLayer);

		var spriteSheet = new createjs.SpriteSheet(this.assets.spriteSheetStatics);
		var sprite = new createjs.Sprite(spriteSheet, 'ui-bezel');

		bgLayer.addChild(sprite);

		this.reelsComponent = new G.ReelsComponent();

		this.reelsComponent.init(this.setup, spriteSheet);
		this.reelsComponent.drawReels();
		bgLayer.addChild(this.reelsComponent);
		this.reelsComponent.x = bezelMarginL;
		this.reelsComponent.y = bezelMarginT;

		var sceneMask = new createjs.Shape();
		sceneMask.graphics.setStrokeStyle(0)
			.drawRect(bezelMarginL, bezelMarginT, bezelW, bezelH)
			.closePath();
		this.stage.addChild(sceneMask);
		if (!this.setup.devMode) this.reelsComponent.mask = sceneMask;



		var self = this;

		window.document.onkeydown = function(e) {

			console.log('e', e.keyCode);

			switch(e.keyCode) {
				//space
				case 32 :
				self.reelsComponent.spinReels();
				break;
			}
		};

	};


	G.Game = Game;

})();