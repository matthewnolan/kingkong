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

	p.assets = null;

	p.init = function(stage, serverInterface) {
		this.serverInterface = serverInterface;
		this.stage = stage;

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
		this.initUIEvents();
	};

	p.setupDisplay = function() {
		var bezelMarginL = this.setup.bezelMarginL;
		var bezelMarginT = this.setup.bezelMarginT;
		var bezelW = this.setup.bezelW;
		var bezelH = this.setup.bezelH;

		//var bgLayer = new createjs.Container();
		//this.stage.addChild(bgLayer);

		var spriteSheet = new createjs.SpriteSheet(this.assets.spriteSheetStatics);
		var sprite = new createjs.Sprite(spriteSheet, 'ui-bezel');
		this.stage.addChild(sprite);

		this.reelsComponent = new G.ReelsComponent();
		this.reelsComponent.init(this.setup, spriteSheet);
		this.reelsComponent.drawReels();
		this.reelsComponent.x = bezelMarginL;
		this.reelsComponent.y = bezelMarginT;
		this.stage.addChild(this.reelsComponent);

		var sceneMask = new createjs.Shape();
		sceneMask.graphics.setStrokeStyle(0)
			.drawRect(bezelMarginL, bezelMarginT, bezelW, bezelH)
			.closePath();
		this.stage.addChild(sceneMask);

		if (!this.setup.devMode) {
			this.reelsComponent.mask = sceneMask;
		}

	};

	p.initUIEvents = function() {

		var self = this;
		window.document.onkeydown = function(e) {
			switch(e.keyCode) {
				//space //enter
				case 32:
				case 0:
					self.reelsComponent.spinReels();
					break;
			}
		};

		createjs.Touch.enable(this.stage);

		var myElement = document.querySelector('#app');
		var mc = new Hammer(myElement);
		mc.get('swipe').set({
			direction: Hammer.DIRECTION_ALL
		});

		mc.get('pinch').set({
			enable: true
		});

		mc.on('swipe', function() {
			self.reelsComponent.spinReels();
		});

		mc.on('pinchin', function() {
			//G.util.showGaffMenu();
		});

		mc.on('pinchout', function() {
			//G.util.hideGaffMenu();
		});

		if (!this.setup.domHelpers) {
			$('.dom-helpers').remove();
		}

	};


	G.Game = Game;

})();