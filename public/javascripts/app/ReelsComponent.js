/*! kingkong 0.0.1 - 2015-02-03
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var ReelsComponent = function() {
		this.Container_constructor();
	};

	var p = createjs.extend(ReelsComponent, createjs.Container);
	p.constructor = ReelsComponent;

	p.symbolSprites = null;

	p.setup = null;

	p.reelsData = [
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
	];

	p.reels = [];

	p.reelMap = null;

	p.init = function(setup, symbolSprites) {
		this.setup = setup;
		this.symbolSprites = symbolSprites;
		this.reelsMap = setup.reelMap;

		this.initDomEvents();

		if (setup.reelAnimation.shuffleReels) {
			this.shuffleReels();
		}

	};

	p.shuffleReels = function() {
		var i, len = this.reelsData.length;
		for (i = 0; i < len; i++) {
			this.shuffle(this.reelsData[i]);
		}
	};

	p.shuffle = function(array) {
		var currentIndex = array.length, temporaryValue, randomIndex ;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	};

	p.drawReels = function() {
		var i, len = this.reelsData.length, reel;
		var symbolW = this.setup.symbolW;
		var reelMarginR = this.setup.reelMarginRight;

		for (i = 0; i < len; i++) {
			reel = new G.Reel();
			reel.init(this.setup, this.symbolSprites, this.reelsData[i]);
			this.addChild(reel);
			reel.drawReel();
			this.reels.push(reel);
			reel.x = symbolW * i + reelMarginR * i;
		}
	};

	p.spinReels = function() {
		console.log('spinReels');
		var self = this;
		var i, len = this.reels.length, reel;
		var maxDelay = this.setup.reelAnimation.delay.max;

		var getDelay = function(i) {
			if (self.setup.reelAnimation.delay.random === true) {
				return Math.random() * maxDelay;
			}
			if (self.setup.reelAnimation.delay.sequenced === true) {
				return maxDelay / self.reels.length * i;
			}
		};

		for (i = 0; i < len; i++)
		{
			var delay = getDelay(i);
			reel = this.reels[i];
			reel.spinInfinite(delay);

		}
	};

	p.updateSpinSpeed = function(val) {
		var i, len = this.reels.length, reel;
		for (i = 0; i < len; i++)
		{
			reel = this.reels[i];
			reel.spinSpeedIncrement(val/100);
		}
	};

	/**
	 * DOM events
	 * for development only
	 */
	p.initDomEvents = function() {
		var self = this;
		$('#gasPedal').on('input', function(e) {
			var newSpeed = $(e.target).val();
			self.updateSpinSpeed(newSpeed);
		});
	};

	G.ReelsComponent = createjs.promote(ReelsComponent, "Container");

})();