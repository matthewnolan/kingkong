/*! kingkong 0.0.6 - 2015-02-11
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * This GameComponent is responsible for showing and hiding symbol animations.
	 * SpriteSheet driven animations are stored as 2D Array (symbolsMatrix), 1st level of the array represents each reel
	 * and this reel array stores a sprite for each visible symbol on that reel.
	 * Sprites are arranged over each visible symbol.
	 * Playing and Hiding of animations should be called via the G.SymbolAnimCommand.
	 * @class SymbolWinsComponent
	 * @constructor
	 * @extends G.GameComponent
	 * @uses createjs.Container
	 */
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
	 *
	 * @const SCALE_FACTOR
	 * @type {number}
	 */
	p.SCALE_FACTOR = (1 / 0.83333);

	/**
	 * @property symbolsMatrix
	 * @type {createjs.Sprite[][]}
	 */
	p.symbolsMatrix = [];

	/**
	 * Store a reference to any sprite currently playing an animation.
	 * Helps remove them later
	 * @property currentlyPlayingSprites
	 * @type {Array}
	 */
	p.currentlyPlayingSprites = [];

	/**
	 * initialisedSpritesNum
	 * @type {number}
	 */
	p.initialisedSpritesNum = 0;

	/**
	 * The animation label suffix, take this from the texture packer output.
	 * The current convention is to have animation keys in this format: symbol.frameLabel + "intro__001";
	 * May consdier making this a setup.json variable.
	 *
	 * @type {string}
	 */
	p.animationLabelSuffix = "intro__001";

	/**
	 * init the game component vars.
	 * @method init
	 * @param {Object} setup
	 * @param {G.SignalDispatcher} signalDispatcher
	 * @param {createjs.SpriteSheet} symbolAnims - the data object returned by the preloader when loading this symbol_anims.json
	 */
	p.init = function(setup, signalDispatcher, symbolAnims) {
		this.GameComponent_init(setup, signalDispatcher);
		this.symbolAnims = symbolAnims;
	};

	/**
	 * Call this function if you'd like to see a visual representation of where invisible sprites are located on the reels
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
				container.addChild(shape);
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
		// var spritesheet = new createjs.SpriteSheet(this.symbolAnims);
		var spritesheet = this.symbolAnims;
		var i, j, sprite;
		var reelLen = this.setup.numberOfReels;
		var symbolLen = this.setup.symbolsPerReel;
		var symbolW = this.setup.symbolW;
		var symbolH = this.setup.symbolH;
		var reelMarginR = this.setup.reelMarginRight;
		var symbolMarginB = this.setup.symbolMarginBottom;

		for (i = 0; i < reelLen; i++) {

			this.symbolsMatrix.push([]);

			for (j = 0; j < symbolLen; j++) {
				sprite = new createjs.Sprite(spritesheet, 0);
				sprite.x = i * symbolW + i * reelMarginR;
				sprite.y = j * symbolH + j * symbolMarginB;
				sprite.scaleX = sprite.scaleY = this.SCALE_FACTOR;
				this.addChild(sprite);
				this.symbolsMatrix[i].push(sprite);
				sprite.visible = false;
				if (this.setup.failSafeInitisalisation) {
					sprite.on("animationend", this.handleAnimationEnd, this);
					G.Utils.callLater(this.playThisSprite, [sprite, "m1intro__001"], this, 0);
				}
				this.initialisedSpritesNum++;
			}
		}
	};

	/**
	 * Clears and hides all currently playing sprites
	 * @method hideAll
	 */
	p.hideAll = function() {
		var i, len = this.currentlyPlayingSprites.length;
		for (i = 0; i < len; i++) {
			this.hideThisSprite(this.currentlyPlayingSprites[i]);
		}
		this.currentlyPlayingSprites = [];
	};

	/**
	 * Helper method to hide a passed sprite
	 * @method hideThisSprite
	 * @param {createjs.Sprite} sprite
	 */
	p.hideThisSprite = function(sprite) {
		sprite.gotoAndStop(0);
		sprite.visible = false;
	};

	/**
	 * Helper method to show and play a passed sprite.  Animation is defined in the id parameter
	 * @param {createjs.Sprite} sprite
	 * @param {string} id - Matching string to a particular symbol_anims.json animations
	 * @param {boolean} autoAppend - concatenate this.animationLabelSuffix.
	 */
	p.playThisSprite = function(sprite, id, autoAppend) {
		if (autoAppend) {
			id = id + this.animationLabelSuffix;
		}
		sprite.visible = true;
		sprite.gotoAndPlay(id.toLowerCase());
		this.currentlyPlayingSprites.push(sprite);
	};

	/**
	 * Plays the sprite animation for id at the passed row and col.
	 *
	 * @method playSpriteByRowCol
	 * @param row
	 * @param col
	 * @param id
	 */
	p.playSpriteByRowCol = function(row, col, id) {
		var sprite = this.symbolsMatrix[row][col];
		this.playThisSprite(sprite, id.toLowerCase());
	};

	p.handleAnimationEnd = function(e) {
		var sprite = e.currentTarget;
		sprite.removeAllEventListeners();
		this.hideThisSprite(sprite);
		// console.log('handleAnimEnd', this.initialisedSpritesNum);
		if (--this.initialisedSpritesNum === 0) {
			this.cacheCompleted.dispatch();
		}
	};

	/**
	 * This plays the same win anim across the payline for each winSquaresNum.
	 * Optionally append the animationLabelSuffix automatically.
	 * @todo lose the 2 from the name
	 *
	 * @method showAnimsOnWinLine
	 * @param winLineData
	 * @param winSquaresNum
	 * @param frameLabel
	 * @param autoAppend
	 */
	p.showAnimsOnWinLine = function(winLineData, winSquaresNum, frameLabel, autoAppend) {
		var i, len = winLineData.length, lineIndex;
		if (winSquaresNum > len) {
			throw "Maximum number of winSquares exceeded";
		}

		for (i = 0; i < winSquaresNum; i++) {
			lineIndex = winLineData[i];
			var sprite = this.symbolsMatrix[i][lineIndex];
			this.playThisSprite(sprite, frameLabel, autoAppend);
		}
	};

	/**
	 * To call different symbol anims on a single payline, use this function.
	 * Optionally append the animationLabelSuffix automatically.
	 *
	 * @method playMixedAnims
	 * @param payline
	 * @param winSquaresNum
	 * @param frameLabels
	 * @param autoAppend
	 */
	p.playMixedAnims = function(payline, winSquaresNum, frameLabels, autoAppend) {

		console.log('playMixedAnims:', payline, winSquaresNum, frameLabels, autoAppend);

		var reelIndex;
		var symbolIndex;
		for (reelIndex = 0; reelIndex < winSquaresNum; reelIndex++) {
			symbolIndex = payline[reelIndex];
			var sprite = this.symbolsMatrix[reelIndex][symbolIndex];
			var frameLabel = frameLabels[reelIndex];
			console.log('reel' + reelIndex + " play:" + frameLabel);
			this.playThisSprite(sprite, frameLabel, autoAppend);
		}
	};


	G.SymbolWinsComponent = createjs.promote(SymbolWinsComponent, "GameComponent");

})();