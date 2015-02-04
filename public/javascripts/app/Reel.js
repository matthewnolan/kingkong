/*! kingkong 0.0.1 - 2015-02-04
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var Reel = function() {
		this.Container_constructor();
	};

	var p = createjs.extend(Reel, createjs.Container);
	p.constructor = Reel;

	p.reelData = [];

	p.setup = null;

	p.symbolSprites = null;

	p.containers = {
		main: this,
		wraps: []
	};

	/**
	 * Dynamically alter the speed of reels by changing this percentage:
	 * eg. 0.5 = half speed reels
	 * @type {number}
	 */
	p.speedPercentage = 0.5;

	/**
	 * Maximum Speed the reels can spin in pixels per second
	 * @type {number}
	 */
	p.speedConstant = 4000;

	p.spriteMap = ['ww','m1', 'm2', 'm3', 'm4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f0', 'd1', 'd2', 'd3', 'd4', 'b1', 'b2'];

	p.tween = null;

	p.scheduleSpeedChange = false;

	p.init = function(setup, symbolSprites, reelData) {
		this.setup = setup;
		this.symbolSprites = symbolSprites;
		this.reelData = reelData;
	};

	p.getTime = function() {
		//s = d/t;
		//st = d;
		//t = d/s;
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var distanceInPixels = symbolH * symbolsLen + symbolMarginB * symbolsLen;
		var time = distanceInPixels / (this.speedPercentage * this.speedConstant / 1000);
		return time;
	};

	p.drawReel = function() {
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var l, j, sp;
		for (l = 0; l < 2; l++) {
			var wrap = new createjs.Container();
			this.addChild(wrap);

			for (j = 0; j < this.reelData.length; j++) {
				sp = new createjs.Sprite(this.symbolSprites, this.spriteMap[this.reelData[j]]);
				wrap.addChild(sp);
				sp.y = (symbolH * j + symbolMarginB * j);
				console.log('sp.y=', sp.y);
			}

			wrap.y = l * (symbolH * this.reelData.length + symbolMarginB * this.reelData.length);
			this.containers.wraps.push(wrap);
		}
	};

	p.spinInfinite = function(delay) {
		//this.getTime();
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var yPos = symbolH * symbolsLen + symbolMarginB * symbolsLen;
		var self = this;

		this.tween = createjs.Tween.get(self, {override:true, loop:true, paused:true, position:0})
			.to({y: -yPos}, self.getTime())
			.call(this.handleComplete);

		var spin = function() {
			createjs.Tween.get(self).play(self.tween);
		};
		setTimeout(spin, delay);
	};

	p.handleComplete = function() {
		console.log('spin loop completed');

		if (this.scheduleSpeedChange) {
			var symbolH = this.setup.symbolH;
			var symbolMarginB = this.setup.symbolMarginBottom;
			var symbolsLen = this.reelData.length;
			var yPos = symbolH * symbolsLen + symbolMarginB * symbolsLen;
			var self = this;

			createjs.Tween
				.get(this, {override: true, loop:true, position:0})
				.to({y: this.y - yPos}, self.getTime())
				.call(this.handleComplete);
			this.scheduleSpeedChange = false;
		}



	};

	p.spinSpeedIncrement = function(val) {
		if (this.speedPercentage !== val) {
			this.speedPercentage = val;
			this.scheduleSpeedChange = true;
		}
	};



	G.Reel = createjs.promote(Reel, "Container");

})();