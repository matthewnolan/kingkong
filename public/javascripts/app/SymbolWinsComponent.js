/*! kingkong 0.0.6 - 2015-02-11
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var SymbolWinsComponent = function() {
		this.GameComponent_constructor();
	};

	var p = createjs.extend(SymbolWinsComponent, G.GameComponent);
	p.constructor = SymbolWinsComponent;

	/**
	 * the spritesheet data for symbol win animations loaded by Preloader
	 * @property symbolAnims
	 * @type {null}
	 */
	p.symbolAnims = null;

	/**
	 * Scale the symbols by this amount, determined by the scale reduction (n) used in Texturepacker to the ratio 1/n
	 * @const SCALE_FACTOR
	 * @type {number}
	 */
	p.SCALE_FACTOR = (1 / 0.9375);

	/**
	 * @param setup
	 * @param signalDispatcher
	 * @param symbolAnims
	 */
	p.init = function(setup, signalDispatcher, symbolAnims) {
		this.GameComponent_init(setup, signalDispatcher);
		this.symbolAnims = symbolAnims;
	};

	/**
	 * @method drawDebug
	 */
	p.drawDebug = function() {
		var symbolW = this.setup.symbolW;
		var symbolH = this.setup.symbolH;
		var symbolMarginR = this.setup.reelMarginRight;
		var symbolMarginB = this.setup.symbolMarginBottom;

		var i, j, reelsLen = this.setup.numberOfReels, symbolsLen = this.setup.symbolsPerReel, container;
		for (i = 0; i < reelsLen; i++) {
			for (j = 0; j < symbolsLen; j++) {
				container = new createjs.Container();
				this.addChild(container);
				var shape = new createjs.Shape();
				var gp = shape.graphics;
				//gp.setStrokeStyle(3);
				gp.beginStroke("#ff0000");
				gp.beginFill("rgba(128,3,95,0.3)");
				gp.drawRect(0, 0, symbolW, symbolH);
				gp.endFill().endStroke();
				//container.addChild(shape);
				container.x = (i * symbolW) + (i * symbolMarginR);
				container.y = (j * symbolH) + (j * symbolMarginB);
			}
		}
	};

	/**
	 * Draws a symbol sprite on each visible symbol on the reels
	 * @method drawSprites
	 */
	p.drawSprites = function() {
		var spritesheet = new createjs.SpriteSheet(this.symbolAnims);
		var i, j, sprite;
		var reelLen = this.setup.numberOfReels;
		var symbolLen = this.setup.symbolsPerReel;
		var symbolW = this.setup.symbolW;
		var symbolH = this.setup.symbolH;
		var reelMarginR = this.setup.reelMarginRight;
		var symbolMarginB = this.setup.symbolMarginBottom;

		for (i = 0; i < reelLen; i++) {
			for (j = 0; j < symbolLen; j++) {

				sprite = new createjs.Sprite(spritesheet, 0);
				sprite.x = i * symbolW + i * reelMarginR;
				sprite.y = j * symbolH + j * symbolMarginB;
				sprite.scaleX = sprite.scaleY = this.SCALE_FACTOR;
				this.addChild(sprite);
				sprite.visible = true;


			}
		}
	};

	p.runUnifiedSprites = function() {
		var arr = ['d1-sprite__000', 'm1-sprite__000', 'd2-sprite_000', 'f5-sprite__000'];
		var animIndex = 0;
		var i, len = this.getNumChildren(), sprite;

		for (i = 0; i < len; i++) {

			if (animIndex === arr.length) {
				animIndex = 0;
			}

			sprite = this.getChildAt(i);
			sprite.visible = true;
			sprite.gotoAndPlay(arr[animIndex]);

			animIndex++;
		}


	};











	G.SymbolWinsComponent = createjs.promote(SymbolWinsComponent, "GameComponent");

})();