/*! kingkong 0.0.1 - 2015-02-04
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * One Reel defined by this class. Contains a sprite map for mapping sprite ids to symbol sprites.
	 * Sets up and executes the spin animation Tween when reels are spun.
	 * Stops the tween when spinning is ended and signals to the ReelComponent.
	 * @class Reel
	 * @extends createjs.Container
	 * @constructor
	 */
	var Reel = function() {
		this.Container_constructor();
	};

	var p = createjs.extend(Reel, createjs.Container);
	p.constructor = Reel;

	/**
	 * array of symbolData to map
	 * @property reelData
	 * @type {Array}
	 */
	p.reelData = [];

	/**
	 * @property setup
	 * @type {Object}
	 */
	p.setup = null;

	/**
	 * @property signalDispatcher
	 * @type {G.SignalDispatcher}
	 */
	p.signalDispatcher = null;

	/**
	 * @property symbolSprites
	 * @type {createjs.SpriteSheet}
	 */
	p.symbolSprites = null;

	/**
	 * wraps symbol sprites for easier modification there are 2 of these containers because each reel contains duplicate symbols
	 * for wrapping purposes during spin.
	 * @property wrap1
	 * @type {createjs.Sprite[]}
	 */
	p.wrap1 = [];

	/**
	 * wraps symbol sprites for easier modification there are 2 of these containers because each reel contains duplicate symbols
	 * @property wrap2
	 * @type {createjs.Sprite[]}
	 */
	p.wrap2 = [];

	/**
	 * contains an extra row of symbol sprites which are appended above the first row of symbols, so there are some
	 * visible sprites in case the reels are spun to first index position.
	 * @type {createjs.Sprite[]}
	 */
	p.upperBuffer = [];

	/**
	 * @contains an extra 2 rows of symbols sprites which are appended to the last row of symbols, so there are some
	 * visible sprites in case the reels are spun to last index position.
	 * @type {Array}
	 */
	p.lowerBuffer = [];

	/**
	 * @property logEnabled
	 * @type {boolean}
	 */
	p.logEnabled = false;

	/**
	 * Set this number to -2, to schedule the reel spin animation to stop, -1 will make the spin continue to loop for an infinite number spins.
	 * @property sheduleSpinStop
	 * @type {number}
	 */
	p.scheduleSpinStop = -2;

	/**
	 * Dynamically alter the speed of reels by changing this percentage:
	 * eg. 0.5 = half speed reels
	 * @type {number}
	 */
	p.speedPercentage = 0.5;

	/**
	 * Maximum Speed the reels can spin in pixels per second
	 * @const speedConstant
	 * @default 6000
	 * @type {number}
	 */
	p.speedConstant = 5000;

	/**
	 *
	 *
	 * @property spriteMap
	 * @type {string[]}
	 * @example ['ww','m1', 'm2', 'm3', 'm4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f0', 'd1', 'd2', 'd3', 'd4', 'b1', 'b2', 'ww'];
	 * @default null
	 */
	p.spriteMap = null;

	/**
	 * Stores the current spin tween animation
	 * @property tween
	 * @type {null}
	 */
	p.tween = null;

	/**
	 * dispatched when a spin animation on this reel is completed
	 * @property reelSpinEnd
	 * @type {Signal}
	 */
	p.reelSpinEnd = new signals.Signal();

	/**
	 * setTimeout responsible for automatically stopping a reel spin animation.
	 * @property stopTimeout
	 * @type {number}
	 */
	p.stopTimeout = 0;

	/**
	 * The index position the reels must stop at.  Represents the index position inside this.reelsData where the top symbol will stop at.
	 * @property spinResultIndex
	 * @type {number}
	 */
	p.spinResultIndex = 0;

	/**
	 * @property scheduleSymbolUpdate
	 * @type {boolean}
	 */
	p.scheduleSymbolUpdate = false;

	/**
	 * scaleFactor for static symbols: defined in setup.json
	 *
	 * @property scaleFactor
	 * @type {number}
	 * @default null
	 */
	p.scaleFactor = null;

	p.hammerRequested = false;

	/**
	 * Initialise Class vars and passes in instance of setup, symbolSprites, and initial reelData
	 * @method init
	 * @param setup
	 * @param signalDispatcher
	 * @param symbolSprites
	 * @param reelData
	 */
	p.init = function(setup, signalDispatcher, symbolSprites, reelData) {

		this.setup = setup;
		this.signalDispatcher = signalDispatcher;
		this.symbolSprites = symbolSprites;
		this.reelData = reelData;
		this.wrap1 = [];
		this.wrap2 = [];
		this.upperBuffer = [];
		this.lowerBuffer = [];
		this.spriteMap = _.map(this.setup.reelAnimation.symbols.data, function(data) {
			return data.frameLabel;
		});
		this.scaleFactor = this.setup.spritesScaleFactor.staticImages;
	};

	/**
	 * Call this when spin data is received.
	 * The sprites on this reel will be scheduled to update according to the spin data after 1 spin loop.
	 * @see updateSymbolSprites
	 * @method modifyReelData
	 * @param {Number[]} reelData
	 */
	p.modifyReelData = function(reelData) {
		if (reelData.length !== this.reelData.length) {
			throw "reelData count mismatch: " + reelData.length + " should equal this.reelData.length: " + this.reelData.length;
		}
		this.scheduleSymbolUpdate = true;
		this.reelData = reelData;
	};

	/**
	 * If reelData has been modified then schedule this function on during the first spin 'loop'.
	 * This will then update the reel sprites according to the new reelData array
	 * @see modifyReelData
	 * @method updateSymbolSprites
	 */
	p.updateSymbolSprites = function() {
		if (this.scheduleSymbolUpdate) {
			this.scheduleSymbolUpdate = false;
			var i, l, j, len = this.reelData.length, symbolIndex;
			for (i = 0; i < len; i++) {
				symbolIndex = this.reelData[i];
				this.wrap1[i].gotoAndStop(this.spriteMap[symbolIndex]);
				this.wrap2[i].gotoAndStop(this.spriteMap[symbolIndex]);
			}

			for (l = 0; l < 2; l++) {
				var buffer = l === 0 ? this.upperBuffer : this.lowerBuffer;
				for (j = 0; j < 2; j++) {
					symbolIndex = len - 2 + j - (l * (len - 2));
					buffer[j].gotoAndStop(this.spriteMap[this.reelData[symbolIndex]]);
				}
			}
		}

		if (this.hammerRequested) {
			clearInterval(this.stopTimeout);
			this.scheduleSpinStop = -2;
			this.speedPercentage = 1;
		}
	};

	/**
	 * Draws a ReelStrip of symbols based on slotInit.reelStrips indexes and setup.json symbol.frameLabels.
	 * Replacement symbols are derived from setup.json, and if either the index or the label are matching, then replace the symbol sprite image
	 * with the defaultReplacementLabel
	 * debugging sprites are drawn if setup.json activates "devMode":1
	 * Each reelStrip draws a set (wrap) of symbols twice to allow for speedy reelAnimation looping without missing symbols
	 * A buffer (n number of symbols - configurable) is also drawn above and below the 2 wraps to allow for elastic bounce easing on spin animations and to facilitate
	 * the spin animation.
	 *
	 * The fullset of slotInit.reelstips is not drawn here, as animating 90+ symbols in a reelstrip at once is too costly for the cpu / gpu.
	 * So during init, a 10 cut version of the reelStrips iss created.
	 *
	 * @method drawReel
	 */
	p.drawReel = function() {
		var symbolW = this.setup.symbolW;
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var container, len = this.reelData.length;
		var replacementSymbolIndex = this.setup.reelAnimation.symbols.replacement.index;
		var replacementSymbolLabel = this.setup.reelAnimation.symbols.replacement.frameLabel;
		var defaultReplacementLabel = this.setup.reelAnimation.symbols.replacement.defaultLabel;
		var l, j, sp, debugSh, gp, text, text2;
		var reelHeight = this.reelData.length * symbolH + this.reelData.length * symbolMarginB;
		var wrapPosY;
		var spriteContainer;
		for (l = 0; l < 2; l++) {
			//creates 2 reel wrappers
			var wrap = new createjs.Container();
			this.addChild(wrap);

			spriteContainer = l === 0? this.wrap1 : this.wrap2;

			for (j = 0; j < len; j++) {
				//creates a symbol for every index in reelData array
				container = new createjs.Container();
				var frameLabel = this.spriteMap[this.reelData[j]];
				//default replacement switcheroo
				if (frameLabel === replacementSymbolLabel || this.reelData[j] === replacementSymbolIndex) {
					frameLabel = defaultReplacementLabel;
				}

				sp = new createjs.Sprite(this.symbolSprites, frameLabel);
				sp.scaleX = sp.scaleY = this.scaleFactor;

				spriteContainer.push(sp);
				container.addChild(sp);
				if (this.setup.devMode) {
					var wrapColor = l === 0? "#00ff00" : "#ff0000";
					debugSh = new createjs.Shape();
					gp = debugSh.graphics;
					gp.setStrokeStyle(2);
					gp.beginStroke(wrapColor);
					gp.beginFill("rgba(128,3,95,0.3)");
					gp.drawRect(0, 0, symbolW, symbolH);
					gp.endFill().endStroke();
					container.addChild(debugSh);
					text = new createjs.Text("Symbol:" + j + ":" + this.spriteMap[this.reelData[j]], "12px Arial", "#ffffff");
					text2 = new createjs.Text("Wrap:" + l, "12px Arial", "#ffffff");
					text.x = 0;
					container.addChild(text);
					container.addChild(text2);
					text2.y = 14;
				}
				wrap.addChild(container);
				container.y = (symbolH * j + symbolMarginB * j);
			}
			wrapPosY = wrap.y = -l * reelHeight;

			var buffer = l === 0 ? this.upperBuffer : this.lowerBuffer;
			var numBuffer = 2;

			for (j = 0; j < numBuffer; j++) {
				//j rows of symbols to buffer above and below the symbol wrappers
				var symbolBufferWrap = new createjs.Container();
				this.addChild(symbolBufferWrap);
				container = new createjs.Container();
				var tempSymbolIndex = len - numBuffer + j - (l * (len - 2));
				sp = new createjs.Sprite(this.symbolSprites, this.spriteMap[this.reelData[tempSymbolIndex]]);
				sp.scaleX = sp.scaleY = this.scaleFactor;
				container.addChild(sp);
				container.y = (symbolH * j + symbolMarginB * j);
				symbolBufferWrap.addChild(container);
				symbolBufferWrap.y = -reelHeight - numBuffer * (symbolH - symbolMarginB) + (l * (2 * (symbolH - symbolMarginB) + reelHeight * 2));
				buffer.push(sp);

				if (this.setup.devMode) {
					debugSh = new createjs.Shape();
					gp = debugSh.graphics;
					gp.setStrokeStyle(2);
					gp.beginStroke('#0000ff');
					gp.drawRect(0,0,symbolW, symbolH);
					gp.endFill().endStroke();
					container.addChild(debugSh);
					text = new createjs.Text("SymbolIndexBuffer", "12px Arial", "#ffffff");
					text2 = new createjs.Text("Wrap:" + (l + 2), "12px Arial", "#ffffff");
					text.x = 0;
					container.addChild(text);
					container.addChild(text2);
					text2.y = 14;
				}
			}
		}
	};

	/**
	 * Spin this reel to the specified index position with a given delay
	 * @method spinToIndex
	 * @param {Number} index - index of symbol on this reel to spin to (top left of reel should spin to this index)
	 * @param {Number} delay - Millis til this spin will start
	 */
	p.spinToIndex = function(index, delay) {
		var self = this;
		this.hammerRequested = false;
		this.speedPercentage = 0.5;
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var spinDelay = delay || 0;
		var reelH = symbolH * symbolsLen + symbolMarginB * symbolsLen;
		var yPos = reelH;
		var tweenTime = this.getTime();

		this.y = -this.spinResultIndex * symbolH + -this.spinResultIndex * symbolMarginB;

		this.spinResultIndex = index;
		this.scheduleSpinStop = -1;

		if (this.logEnabled) {
			console.log('Tween_Start:', this.y, yPos, tweenTime);
			console.log('SymbolsHeight:', symbolH * symbolsLen + symbolMarginB * symbolsLen);
		}

		createjs.Tween.get(this)
			.wait(delay)
			.play(
				createjs.Tween.get(this, {loop: false, paused:true})
					.to({y:yPos}, tweenTime, createjs.Ease.getElasticIn(2,2))
					.call(this.loopSpin)
		);


		this.stopTimeout = setTimeout(function() {
			self.scheduleFastStop();
		}, this.setup.reelAnimation.duration + spinDelay);
	};

	/**
	 * Returns the time required to tween this reel through a set of this.reelData.length symbols
	 * @method getTime
	 * @returns {number}
	 */
	p.getTime = function() {
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var distanceInPixels = symbolH * symbolsLen + symbolMarginB * symbolsLen;
		return distanceInPixels / (this.speedPercentage * this.speedConstant / 1000);
	};

	/**
	 * Begins a new loop of spinning animation beginning at this.y 0 and ending at the end of 1 set of symbols
	 * @method loopSpin
	 */
	p.loopSpin = function() {
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var reelH = symbolH * symbolsLen + symbolMarginB * symbolsLen;
		var tweenTime = this.getTime();
		var yPos;
		if (this.scheduleSpinStop === -1) {
			this.y = 0;
			yPos = reelH;
			this.updateSymbolSprites();

		} else if (this.scheduleSpinStop === -2) {
			this.stopSpinTween();
			return;

		} else {
			return;
		}

		if (this.logEnabled) {
			console.log('Tween_Loop:', this.y, yPos, tweenTime);
		}

		createjs.Tween
			.get(this, {override: true, loop: false })
			.to({y: yPos}, tweenTime, createjs.Ease.linear())
			.call(this.loopSpin)
			.on("change", this.onYPosUpdate);
	};

	/**
	 * Returns the time required for the stop tween animation (from this.y 0 to the symbol stop index). Uses number of pixels as the distance
	 * @method getStopTime
	 * @param {number} index - the symbol index the tween animation is going to stop at
	 * @returns {number}
	 */
	p.getStopTime =function(index) {
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var reelH = symbolsLen * symbolH + symbolsLen * symbolMarginB;
		var distanceInPixels = (symbolH * index + symbolMarginB * index) + reelH;
		return distanceInPixels / (this.speedPercentage * this.speedConstant / 1000);
	};


	p.stopSpinTween = function() {
		console.log('stopSpinTween', this.spinResultIndex);
		var self = this;
		var index = this.spinResultIndex;
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var reelH = (symbolH * symbolsLen) + (symbolMarginB * symbolsLen);
		var yPos = -(symbolH * index + symbolMarginB * index) + reelH;
		var stopTime = this.getStopTime(index);
		var easeAmp = 1 + index * (this.reelData.length * 0.2);
		var easeTime = 1 - index * (this.reelData.length * 0.02);

		setTimeout(function() {
			self.signalDispatcher.playSound.dispatch("reelstop1");
		}, stopTime - 300);

		this.y = 0;

		if (this.logEnabled) {
			console.log('Tween_Stop', this.y, yPos, stopTime, 'easeAmp=', easeAmp);
		}

		createjs.Tween
			.get(this, {override: true, loop:false})
			.to({y: yPos}, stopTime, createjs.Ease.getElasticOut(easeAmp,easeTime))
			.call(this.handleSpinComplete)
			.on("change", this.onYPosUpdate);
	};

	/**
	 * For debugging spin animation purposes
	 * @method onYPosUpdate
	 */
	p.onYPosUpdate = function() {
		var self = this.target;
		if (self.logEnabled) {
			console.log('this.Container Y=', Math.round(self.y));
		}
	};

	/**
	 * Manually stops the current spin animation - also called automatically by the stopTimeout.
	 * @method fastStop
	 */
	p.scheduleFastStop = function() {
		if (this.scheduleSpinStop > -2) {
			this.hammerRequested = true;
		}
	};


	/**
	 * Dispatches the reelSpinEnd signal when the reel spin animation is completed.
	 * @event handleSpinComplete
	 */
	p.handleSpinComplete = function() {
		this.reelSpinEnd.dispatch();
	};

	/**
	 * Modify the spin speed percentage value (accepts 0-100%);
	 * Reels will spin at this perecentage of the speedConstant in pixels per second.
	 * @method spinSpeedIncrement
	 * @param val
	 */
	p.spinSpeedIncrement = function(val) {
		if (this.speedPercentage !== val) {
			this.speedPercentage = val;
		}
	};



	G.Reel = createjs.promote(Reel, "Container");

})();