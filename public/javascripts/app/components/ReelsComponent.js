/*! kingkong 0.0.1 - 2015-02-03
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * GameComponent responsible for drawing symbols to each reel and spinning them.
	 * @class ReelsComponent
	 * @extends G.GameComponent
	 * @constructor
	 */
	var ReelsComponent = function() {
		this.GameComponent_constructor();
	};

	var p = createjs.extend(ReelsComponent, G.GameComponent);
	p.constructor = ReelsComponent;

	/**
	 * @property symbolSprites
	 * @type {Object}
	 */
	p.symbolSprites = null;

	/**
	 * @property reelData
	 * @type {Number[]}
	 */
	p.reelsData = [
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
	];

	/**
	 * @property reels
	 * @type {G.Reel[]}
	 */
	p.reels = [];

	/**
	 * @property reelMap
	 * @type {Object}
	 */
	p.reelMap = null;

	/**
	 * Number of reels currently spinning
	 * @property reelsSpinning
	 * @type {number}
	 */
	p.reelsSpinning = 0;

	/**
	 * @method init
	 * @param setup {Object}
	 * @param signalDispatcher {G.SignalDispatcher}
	 * @param symbolSprites {Object}
	 */
	p.init = function(setup, signalDispatcher, symbolSprites) {
		this.GameComponent_init(setup, signalDispatcher);
		this.reelsMap = setup.reelMap;
		this.symbolSprites = symbolSprites;
		this.initDomEvents();

		if (setup.reelAnimation.shuffleReels) {
			this.shuffleReels();
		}
	};

	/**
	 * @method shuffleReels
	 */
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

	p.modifySymbomodifySymbolDatalData = function() {
		var i, len = this.reels.length, reel;
		for (i = 0; i < len; i++) {
			reel = this.reels[i];
			reel.modifyReelData([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
		}
	};

	/**
	 * @method drawReels
	 */
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

	/**
	 * Spins all reels with a delay configuration from setup.json
	 * Stops reels if they are currently spinning.
	 * Clear any winline/animation overlays
	 * Play Spin Sound
	 * @method spinReels
	 */
	p.spinReels = function() {
		var self = this;
		var i, len = this.reels.length, reel, delay;
		var maxDelay = this.setup.reelAnimation.delay.max;

		var getDelay = function(i) {
			if (self.setup.reelAnimation.delay.random === true) {
				return Math.random() * maxDelay;
			}
			if (self.setup.reelAnimation.delay.sequenced === true) {
				return maxDelay / self.reels.length * i;
			}
		};

		if (this.reelsSpinning === 0) {
			createjs.Sound.play("spin1");
			this.signalDispatcher.reelSpinStart.dispatch();
			for (i = 0; i < len; i++)
			{
				delay = getDelay(i);
				reel = this.reels[i];
				if (i === 0) {
					reel.logEnabled = true;
				}




				reel.spinToIndex(0, delay);
				reel.reelSpinEnd.add(this.reelSpinEnd, this);
				this.reelsSpinning++;
			}
		} else {
			setTimeout(function() {
					createjs.Sound.stop("spin1");
				}, 200
			);

			for (i = 0; i < len; i++)
			{
				reel = this.reels[i];
				reel.fastStop();
			}
		}
	};

	/**
	 * method updateSpinSpeed
	 * @param val {Number}
	 */
	p.updateSpinSpeed = function(val) {
		var i, len = this.reels.length, reel;
		for (i = 0; i < len; i++)
		{
			reel = this.reels[i];
			reel.spinSpeedIncrement(val/100);
		}
	};

	/**
	 * Signal dispatched when a reel spin is finished
	 * @Event reelSpinEnd
	 */
	p.reelSpinEnd = function() {
		if (--this.reelsSpinning === 0)
		{
			this.signalDispatcher.reelSpinComplete.dispatch();
		}
	};

	/**
	 * DOM events
	 * for development only
	 * @method initDomEvents
	 */
	p.initDomEvents = function() {
		var self = this;
		var gasPedal = document.querySelector('#gasPedal');
		gasPedal.addEventListener("input", function() {
			var newSpeed = gasPedal.value;
			console.log('newSpeed', newSpeed);
			self.updateSpinSpeed(newSpeed);
		});
	};

	G.ReelsComponent = createjs.promote(ReelsComponent, "GameComponent");

})();