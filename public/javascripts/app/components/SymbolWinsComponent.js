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
	 * Playing and Hiding of animations is normally called via the G.SymbolAnimCommand
	 * (although anims are played during slow init caching and debugging purposes)
	 *
	 * @class SymbolWinsComponent
	 * @extends G.GameComponent
	 * @constructor
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


	p.gaffAnims = null;

	/**
	 * Scale the symbols by this amount, determined by the scale reduction (n) used in Texturepacker to the ratio 1/n
	 *
	 * @const scaleFactor
	 * @type {number}
	 * @default null
	 */
	p.scaleFactor = null;

	/**
	 *
	 * @type {null}
	 */
	p.scaleFactorGaffe = null;

	/**
	 * The 2D array where sprites are stored.  Each sprite is initialised with the Symbols Sprite Sheet.
	 *
	 * @property symbolsMatrix
	 * @type {createjs.Sprite[][]}
	 */
	p.symbolsMatrix = [];	



	p.gaffSymbolsMatrix = [];

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
	 * May consider making this a setup.json variable.
	 *
	 * @type {string}
	 */
	p.animationLabelSuffix = "intro__001";


	/**
	 * init the game component vars.
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {G.SignalDispatcher} signalDispatcher
	 * @param {createjs.SpriteSheet} symbolAnims - the data object returned by the preloader when loading this symbol_anims.json
	 */
	p.init = function(setup, signalDispatcher, symbolAnims, gaffAnims) {
		this.GameComponent_init(setup, signalDispatcher);
		this.symbolAnims = symbolAnims;
		this.gaffAnims = gaffAnims;
		this.scaleFactor = 1 / setup.spritesScaleFactor.symbolAnims;
		this.scaleFactorGaffe = 1 / setup.spritesScaleFactor.bigWinAnimSymbol;


	};

	/**
	 * Call this function if you'd like to see a visual representation of where invisible sprites are located on the reels
	 * This method is called if devmode in setup.json is switched on.
	 *
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
	 *
	 * @method drawSprites
	 */
	p.drawSprites = function() {
		var spritesheet = this.symbolAnims;
		var i, j, sprite, gaffSprite;
		var reelLen = this.setup.numberOfReels;
		var symbolLen = this.setup.symbolsPerReel;
		var symbolW = this.setup.symbolW;
		var symbolH = this.setup.symbolH;
		var reelMarginR = this.setup.reelMarginRight;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var slowInit = this.setup.failSafeInitisalisation;

		for (i = 0; i < reelLen; i++) {

			this.symbolsMatrix.push([]);

			this.gaffSymbolsMatrix.push([]);

			for (j = 0; j < symbolLen; j++) {
				sprite = new createjs.Sprite(spritesheet, 0);
				sprite.x = i * symbolW + i * reelMarginR;
				sprite.y = j * symbolH + j * symbolMarginB;
				sprite.scaleX = sprite.scaleY = this.scaleFactor;
				this.addChild(sprite);
				this.symbolsMatrix[i].push(sprite);
				sprite.visible = false;
				if (slowInit) {
					sprite.on("animationend", this.handleAnimationEnd, this);
					G.Utils.callLater(this.playThisSprite, [sprite, "m1intro__001"], this, 0);
				}
				this.initialisedSpritesNum++;

				gaffSprite = new createjs.Sprite(this.gaffAnims, 0);
				gaffSprite.x = i * symbolW + i * reelMarginR;
				gaffSprite.y = j * symbolH + j * symbolMarginB;
				gaffSprite.scaleX = gaffSprite.scaleY = this.scaleFactorGaffe;
				this.addChild(gaffSprite);
				this.gaffSymbolsMatrix[i].push(gaffSprite);
				gaffSprite.visible = false;				
			}
		}
	};

	/**
	 * Clears and hides all currently playing sprites
	 *
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
	 * @param {string} frameLabel - Matching string to a particular symbol_anims.json animations
	 * @param {boolean} autoAppend - concatenate this.animationLabelSuffix.
	 */
	p.playThisSprite = function(sprite, frameLabel, autoAppend) {
		if (autoAppend) {
			frameLabel = frameLabel + this.animationLabelSuffix;
		}
		sprite.visible = true;
		sprite.gotoAndPlay(frameLabel.toLowerCase());
		this.currentlyPlayingSprites.push(sprite);
	};

	/**
	 * Plays the sprite animation for id at the passed row and col.
	 *
	 * @method playSpriteByRowCol
	 * @param {number} row
	 * @param {number} col
	 * @param {string} frameLabel
	 */
	p.playSpriteByRowCol = function(row, col, frameLabel) {
		var sprite = this.symbolsMatrix[row][col];
		this.playThisSprite(sprite, frameLabel.toLowerCase());
	};

	/**
	 * event handler called when a sprite's animation is completed.
	 * Currently it's set to call once only, and is used to call the cacheCompleted signals if all sprites have initialised.
	 *
	 * @method handleAnimationEnd
	 * @param {createjs.Event} e
	 */
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
	 *
	 * @method showAnimsOnWinLine
	 * @param {Object} winLineData as defined in setup.json
	 * @param {number} winSquaresNum number of squares to animate over
	 * @param {string} frameLabel animation label defined in spritesheet
	 * @param {boolean} autoAppend if flag is true, append the animation suffix to the frameLabel
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


	p.playGaffAnimsOnWinLine = function(winLineData, winSquaresNum, frameLabel, autoAppend) {
		var i, len = winLineData.length, lineIndex;
		if (winSquaresNum > len) {
			throw "Maximum number of winSquares exceeded";
		}

		for (i = 0; i < winSquaresNum; i++) {
			lineIndex = winLineData[i];
			var sprite = this.gaffSymbolsMatrix[i][lineIndex];
			this.playThisSprite(sprite, frameLabel, autoAppend);
		}
	};

	/**
	 * To call different symbol anims on a single payline, use this function.
	 * Optionally append the animationLabelSuffix automatically.
	 *
	 * @method playMixedAnims
	 * @param {number} payline index according to setup.json
	 * @param {number} winSquaresNum number of squares to animate over
	 * @param {array} frameLabels array of frameLabels to animate - eg.["m1", "m2"] plays m1 then m2 on first two reels
	 * @param {boolean} autoAppend if flag is true, append the animation suffix to the frameLabels
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