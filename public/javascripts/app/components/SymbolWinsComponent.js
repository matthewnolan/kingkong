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
	 * @type {Object}
	 */
	p.symbolAnims = null;

	/**
	 * Scale the symbols by this amount, determined by the scale reduction (n) used in Texturepacker to the ratio 1/n
	 * @const SCALE_FACTOR
	 * @type {number}
	 */
	p.SCALE_FACTOR = (1 / 0.9375);

	/**
	 * Stored reference to symbols, top left is 0 indexed Sprite, then go down to next row, until bottom symbols then continues to next reel
	 * @type {createjs.Sprite}
	 */
	p.symbols = [];

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
				//sprite.on("animationend", this.handleAnimationEnd);
				sprite.visible = false;
				this.symbols.push(sprite);
			}
		}
	};

	/**
	 * hide animation at the end of one play
	 * @method handleAnimationEnd
	 * @param e
	 */
	/*
	p.handleAnimationEnd = function(e) {
		//var sprite = e.target;
		//sprite.visible = false;
	};
	*/

	p.hideSymbolAnim = function(symbolIndex) {
		this.symbols[symbolIndex].visible = false;
	};

	/**
	 * test symbol anims here
	 */
	p.runUnifiedSprites = function() {

		this.runAnimationBySymbolIndex(0, 'd1-sprite__000');
		this.runAnimationBySymbolIndex(1, 'd1-sprite__000');
		this.runAnimationBySymbolIndex(2, 'd1-sprite__000');
		this.runAnimationBySymbolIndex(3, 'm1-sprite__000');
		this.runAnimationBySymbolIndex(4, 'm1-sprite__000');
		this.runAnimationBySymbolIndex(5, 'm1-sprite__000');
		this.runAnimationBySymbolIndex(6, 'd2-sprite__000');
		this.runAnimationBySymbolIndex(7, 'd2-sprite__000');
		this.runAnimationBySymbolIndex(8, 'd2-sprite__000');

	};

	/**
	 *
	 * @param {Number} symbolIndex - index in the array where the sprite is stored. Stored in this order reel[0]: t, m, b, reel[1]: t, m, b eg... this.symbols[4] = top symbol in second reel
	 * @param {String} id - id of animation -see symbol_anims.json 'animations'.
	 */
	p.runAnimationBySymbolIndex = function(symbolIndex, id) {
		this.symbols[symbolIndex].visible = true;
		this.symbols[symbolIndex].gotoAndPlay(id);
	};











	G.SymbolWinsComponent = createjs.promote(SymbolWinsComponent, "GameComponent");

})();