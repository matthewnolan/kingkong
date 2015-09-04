/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * This component is reponsible for drawing the sprites which will play the big win animations
	 *
	 * @class BigWinComponent
	 * @extends G.GameComponent
	 * @constructor
	 */
	var BigWinComponent = function() {
		this.GameComponent_constructor();
	};
	var p = createjs.extend(BigWinComponent, G.GameComponent);
	p.constructor = BigWinComponent;

	/**
	 * @property bigWinSprites;
	 * @type {createjs.Sprite[]}
	 */
	p.bigWins = [];

	/**
	 * The SpriteSheet which contains the big win animation and it's small symbol animation counterpart
	 *
	 * @property combinationSpriteSheet;
	 * @type {createjs.SpriteSheet}
	 */
	p.combinationSpriteSheet = null;

	/**
	 * scale to affect the combinationSpriteSheet
	 *
	 * @const SCALE_FACTOR
	 * @type {number}
	 */
	p.SCALE_FACTOR = null;

	/**
	 * Store the symbolAnims which will be scaled up to produce the 3x3 and 3x4 animations.
	 *
	 * @property symbolAnimsSpriteSheet
	 * @type {createjs.SpriteSheet}
	 * @default null
	 */
	p.symbolAnimsSpriteSheet = null;

	/**
	 *
	 * @type {createjs.Sprite}
	 */
	p.sprite3x3 = null;

	/**
	 *
	 * @type {createjs.Sprite}
	 */
	p.sprite3x4 = null;

	/**
	 *
	 * @type {createjs.Sprite}
	 */
	p.sprite3x5 = null;

	/**
	 * @property currentlyPlayingSprite
	 * @type {null}
	 */
	p.currentlyPlayingSprite = null;

	/**
	 * Initialise component data
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {G.SignalDispatcher} signalDispatcher
	 * @param {createjs.SpriteSheet} combinationSpriteSheet
	 * @param {createjs.SpriteSheet} symbolAnimsSpriteSheet
	 */
	p.init = function(setup, signalDispatcher, combinationSpriteSheet, symbolAnimsSpriteSheet) {
		this.GameComponent_init(setup, signalDispatcher);
		this.combinationSpriteSheet = combinationSpriteSheet;
		this.symbolAnimsSpriteSheet = symbolAnimsSpriteSheet;
		this.SCALE_FACTOR = 1 / this.setup.spritesScaleFactor.bigWinAnimSymbol;
	};

	/**
	 * Initial drawing of component
	 *
	 * @method drawSprites
	 */
	p.drawSprites = function() {
		var symbolsScale = 1 / this.setup.spritesScaleFactor.symbolAnims;

		var symbolW = this.setup.symbolW;
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolMarginR = this.setup.reelMarginRight;
		var width3x3 = symbolW * 3 + symbolMarginR * 2;
		var heightx3 = symbolH * 3 + symbolMarginB * 2;
		var width3x4 = symbolW * 4 + symbolMarginR * 3;
		var width3x5 = symbolW * 5 + symbolMarginR * 4;
		var scaleX_3x3 = (width3x3 / symbolW) * symbolsScale;
		var scaleYx3 = (heightx3 / symbolH) * symbolsScale;
		var scaleX_3x4 = (width3x4 / symbolW) * symbolsScale;
		var scaleX_3x5 = (width3x5 / symbolW) * symbolsScale;

		var sprite3x3 = new createjs.Sprite(this.symbolAnimsSpriteSheet, 0);
		sprite3x3.x = 0;
		sprite3x3.y = 0;
		this.addChild(sprite3x3);
		sprite3x3.scaleX = scaleX_3x3;
		sprite3x3.scaleY = scaleYx3;
		sprite3x3.visible = false;

		var sprite3x4 = new createjs.Sprite(this.symbolAnimsSpriteSheet, 0);
		sprite3x4.x = 0;
		sprite3x4.y = 0;
		this.addChild(sprite3x4);
		sprite3x4.scaleX = scaleX_3x4;
		sprite3x4.scaleY = scaleYx3;
		sprite3x4.visible = false;

		var sprite3x5 = new createjs.Sprite(this.symbolAnimsSpriteSheet, 0);
		sprite3x5.x = 0;
		sprite3x5.y = 0;
		this.addChild(sprite3x5);
		sprite3x5.scaleX = scaleX_3x5;
		sprite3x5.scaleY = scaleYx3;
		sprite3x5.visible = false;


		var combinedSprite3x5 = new createjs.Sprite(this.combinationSpriteSheet, 0);
		combinedSprite3x5.x = 0;
		combinedSprite3x5.y = 0;
		combinedSprite3x5.scaleX = combinedSprite3x5.scaleY = this.SCALE_FACTOR;
		this.addChild(combinedSprite3x5);
		combinedSprite3x5.visible = false;
		this.bigWins.push(combinedSprite3x5);

		this.sprite3x3 = sprite3x3;
		this.sprite3x4 = sprite3x4;
		this.sprite3x5 = sprite3x5;
		this.sprite3x5_m1 = combinedSprite3x5;

		if (this.setup.failSafeInitisalisation) {
			combinedSprite3x5.on("animationend", this.handleAnimationEnd, this);
			this.playAnimation();
		}
	};

	/**
	 * Used during slow init (aka failSafeInitialisation)
	 *
	 * @method handleAnimationEnd
	 * @param e
	 */
	p.handleAnimationEnd = function(e) {
		this.currentlyPlayingSprite = e.target;
		this.currentlyPlayingSprite.removeAllEventListeners();
		this.cacheCompleted.dispatch();
		this.hideAnimation();
	};

	/**
	 * Removes any big win animation currently playing or if none, has no effect.
	 *
	 * @method hideAnimation
	 */
	p.hideAnimation = function() {
		if (!this.currentlyPlayingSprite) {
			return;
		}
		this.currentlyPlayingSprite.gotoAndStop(0);
		this.currentlyPlayingSprite.visible = false;
	};

	/**
	 * Plays a big win animation, which currently is a 3x5 m1 animation
	 * If 3x3 or 3x4 type animations should play, we will play a scaled up version of symbolAnim.
	 * If 3x5 type animation and is not an m1... we'll play m1 anyway.
	 *
	 * @method playAnimation
	 * @param type - big win animation type
	 * @param frameLabel - the small symbol frameLabel
	 */
	p.playAnimation = function(type, frameLabel) {
		var sprite;
		var label;

		console.log("Play a big win animation: type,frameLabel", type, frameLabel);


		if (type === 5 && frameLabel === "m1intro__001") {
			//THIS IS A M1 BIG WIN 3x5
			console.log("PLAY_M1_BIG");
			sprite = this.sprite3x5_m1;
			label = "celebration1__000";
		} else {
			//THIS IS ANY OTHER BIG WIN
			label = frameLabel;
			switch(type) {
				case 5:
					sprite = this.sprite3x5;
					
					// MattTemp
					createjs.Sound.stop("spin1");
					createjs.Sound.play("M1_SUPERSTACK");

					break;
				case 4:
					sprite = this.sprite3x4;
					break;
				case 3:
					sprite = this.sprite3x3;
					break;
			}
		}


		//sprite.gotoAndStop(0);
		sprite.visible = true;
		sprite.gotoAndPlay(label);
		sprite.on("animationend", function() {
			sprite.gotoAndStop(0);
			sprite.visible = false;
		});
		this.currentlyPlayingSprite = sprite;
	};



	G.BigWinComponent = createjs.promote(BigWinComponent, "GameComponent");

})();