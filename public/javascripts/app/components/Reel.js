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

	p.setup = null;

	p.symbolSprites = null;

	p.containers = {
		main: this,
		wraps: []
	};

	p.logEnabled = false;

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
	p.speedConstant = 6000;

	/**
	 * @property spriteMap
	 * @type {string[]}
	 */
	p.spriteMap = ['ww','m1', 'm2', 'm3', 'm4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f0', 'd1', 'd2', 'd3', 'd4', 'b1', 'b2'];

	p.tween = null;

	p.scheduleSpeedChange = false;

	p.reelSpinEnd = new signals.Signal();

	p.stopTimeout = 0;

	p.spinResultIndex = 0;

	p.init = function(setup, symbolSprites, reelData) {
		this.setup = setup;
		this.symbolSprites = symbolSprites;
		this.reelData = reelData;
	};

	p.modifyReelData = function(reelData) {
		var i, j, symbolSprite;
		for (i = 0; i < this.containers.wraps.length; i++) {
			var wrap = this.containers.wraps[i];
			for (j = 0; j < wrap.getNumChildren(); j++) {
				symbolSprite = wrap.getChildAt(j);
				symbolSprite.gotoAndStop(this.spriteMap[reelData[j]]);
			}
		}
	};

	p.drawReel = function() {
		var symbolW = this.setup.symbolW;
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var container, len = this.reelData.length;
		var l, j, sp, debugSh, gp, text, text2;
		var reelHeight = this.reelData.length * symbolH + this.reelData.length * symbolMarginB;
		var wrapPosY;
		for (l = 0; l < 2; l++) {
			//creates 2 reel wrappers
			var wrap = new createjs.Container();
			this.addChild(wrap);

			for (j = 0; j < len; j++) {
				//creates a symbol for every index in reelData array
				container = new createjs.Container();
				sp = new createjs.Sprite(this.symbolSprites, this.spriteMap[this.reelData[j]]);
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
					text = new createjs.Text("SymbolIndex:" + j, "12px Arial", "#ffffff");
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
			this.containers.wraps.push(wrap);

			for (j = 0; j < 2; j++) {
				//2 rows of symbols to buffer above and below the symbol wrappers
				var symbolBufferWrap = new createjs.Container();
				this.addChild(symbolBufferWrap);
				container = new createjs.Container();
				var tempSymbolIndex = len - 2 + j - (l * (len - 2));
				sp = new createjs.Sprite(this.symbolSprites, this.spriteMap[this.reelData[tempSymbolIndex]]);
				container.addChild(sp);
				container.y = (symbolH * j + symbolMarginB * j);
				symbolBufferWrap.addChild(container);
				symbolBufferWrap.y = -reelHeight - 2 * (symbolH - symbolMarginB) + (l * (2 * (symbolH - symbolMarginB) + reelHeight * 2));
				this.containers.wraps.push(symbolBufferWrap);

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
			self.fastStop();
		}, this.setup.reelAnimation.duration + spinDelay);
	};

	p.getTime = function() {
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var distanceInPixels = symbolH * symbolsLen + symbolMarginB * symbolsLen;
		return distanceInPixels / (this.speedPercentage * this.speedConstant / 1000);
	};

	p.loopSpin = function() {
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var reelH = symbolH * symbolsLen + symbolMarginB * symbolsLen;
		var tweenTime = this.getTime();
		var yPos;
		if (this.scheduleSpinStop === -1){
			this.y = 0;
			yPos = reelH;
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

	p.getStopTime =function(index) {
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var reelH = symbolsLen * symbolH + symbolsLen * symbolMarginB;
		var distanceInPixels = (symbolH * index + symbolMarginB * index) + reelH;
		return distanceInPixels / (this.speedPercentage * this.speedConstant / 1000);
	};

	p.stopSpin = function(index) {
		this.scheduleSpinStop = -2;
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var reelH = (symbolH * symbolsLen) + (symbolMarginB * symbolsLen);
		var yPos = -(symbolH * index + symbolMarginB * index) + reelH;
		var stopTime = this.getStopTime(index);
		var easeAmp = 1 + index * 0.01;
		var easeTime = 1 - index * 0.02;

		setTimeout(function() {
			createjs.Sound.play("reelstop1");
		}, stopTime - 300);

		this.y = 0;

		if (this.logEnabled) {
			console.log('Tween_Stop', this.y, yPos, stopTime, 'easeAmp=', easeAmp);
		}

		createjs.Tween
			.get(this, {override: true, loop:false})
			.to({y: yPos}, stopTime, createjs.Ease.getElasticOut(easeAmp,easeTime))
			//.to({y: yPos}, stopTime)
			.call(this.handleSpinComplete)
			.on("change", this.onYPosUpdate);
	};

	p.onYPosUpdate = function() {
		var self = this.target;
		if (self.logEnabled) {
			console.log('this.Container Y=', Math.round(self.y));
		}

	};

	p.fastStop = function() {
		if (this.scheduleSpinStop > -2) {
			clearInterval(this.stopTimeout);
			this.stopSpin(this.spinResultIndex);
		}
	};

	p.handleSpinComplete = function() {
		this.reelSpinEnd.dispatch();
	};


	p.spinSpeedIncrement = function(val) {
		if (this.speedPercentage !== val) {
			this.speedPercentage = val;
			this.scheduleSpeedChange = true;
		}
	};



	G.Reel = createjs.promote(Reel, "Container");

})();