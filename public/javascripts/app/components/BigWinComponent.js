/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
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
	 * @property animSprite;
	 * @type {Object}
	 */
	p.bigWinSprites = null;

	/**
	 * scale to affect the big win animation
	 * @const SCALE_FACTOR
	 * @type {number}
	 */
	p.SCALE_FACTOR = 1 / 0.72;

	/**
	 * Initialise component data
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {G.SignalDispatcher} signalDispatcher
	 * @param {Object} bigWinSprites
	 */
	p.init = function(setup, signalDispatcher, bigWinSprites) {
		this.GameComponent_init(setup, signalDispatcher);
		this.bigWinSprites = bigWinSprites;
	};

	/**
	 * @method drawSprites
	 */
	p.drawSprites = function() {
		var spritesheet = new createjs.SpriteSheet(this.bigWinSprites);
		var sprite = new createjs.Sprite(spritesheet, 0);
		sprite.x = 0;
		sprite.y = 0;
		sprite.scaleX = sprite.scaleY = this.SCALE_FACTOR;
		this.addChild(sprite);
		sprite.visible = false;
		this.bigWins.push(sprite);

		if (this.setup.failSafeInitisalisation) {
			sprite.on("animationend", this.handleAnimationEnd, this);
			this.playAnimation();
		}
	};

	p.handleAnimationEnd = function(e) {
		var sprite = e.target;
		sprite.removeAllEventListeners();
		this.cacheCompleted.dispatch();
		this.hideAnimation();
	};

	p.hideAnimation = function() {
		this.bigWins[0].gotoAndStop(0);
		this.bigWins[0].visible = false;
		//this.bigWins[0].gotoAndPlay("celebration1__000");
	};

	/**
	 * @method playAnimation
	 */
	p.playAnimation = function() {
		this.bigWins[0].gotoAndStop(0);
		this.bigWins[0].visible = true;
		this.bigWins[0].gotoAndPlay("celebration1__000");
	};



	G.BigWinComponent = createjs.promote(BigWinComponent, "GameComponent");

})();