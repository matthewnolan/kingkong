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

	p.reelMap = ['ww','m1', 'm2', 'm3', 'm4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f0', 'd1', 'd2', 'd3', 'd4', 'b1', 'b2'];

	p.init = function(setup, symbolSprites) {
		this.setup = setup;
		this.symbolSprites = symbolSprites;

		this.initDomEvents();
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
		var i, len = this.reels.length, reel;
		var delay = 250;
		for (i = 0; i < len; i++)
		{
			reel = this.reels[i];
			reel.spinInfinite(delay * i);
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
			console.log('gasPedal', newSpeed);
			self.updateSpinSpeed(newSpeed);
		});
	};

	G.ReelsComponent = createjs.promote(ReelsComponent, "Container");

})();