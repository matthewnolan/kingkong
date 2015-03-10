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
	 * @type {Number[][]}
	 */
	p.reelsData = [
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
	];

	/**
	 * @property reelStripsData
	 * @type {Number[][]}
	 */
	p.reelStripsData = [

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

	p.spinIndexEl = null;

	/**
	 *
	 * @type {boolean}
	 */
	p.spinRequested = false;

	/**
	 *
	 * @type {null}
	 */
	p.serverInterface = null;

	/**
	 * @method init
	 * @param setup {Object}
	 * @param signalDispatcher {G.SignalDispatcher}
	 * @param symbolSprites {Object}
	 * @param {Array[]} serverReelStrips
	 */
	p.init = function(setup, signalDispatcher, serverInterface, symbolSprites) {
		this.GameComponent_init(setup, signalDispatcher);
		this.reelsMap = setup.reelMap;
		this.serverInterface = serverInterface;
		this.symbolSprites = symbolSprites;

		var i, len = this.reelsData.length;
		if (setup.reelAnimation.shuffleReels) {
			for (i = 0; i < len; i++) {
				G.Utils.shuffle(this.reelsData[i]);
			}
		}

		this.initDomEvents();
	};

	/**
	 * Takes an array of symbol ID's and passes them to each reel to modify symbol sprites at runtime on each reel
	 * @method modifySymbolData
	 * @param {number[]} reelData
	 * @param {boolean} reset
	 */
	p.modifySymbolData = function(reelData, reset) {
		var modifiedReelData = reelData || [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		var i, len = this.reels.length, reel;
		for (i = 0; i < len; i++) {
			reel = this.reels[i];
			if (reset) {
				modifiedReelData = this.reelsData[i];
			}
			reel.modifyReelData(modifiedReelData);
		}
	};

	/**
	 * Creates and initialises each reel, also drawing them to the display.  Call once during app initialisation only.
	 * @method drawReels
	 */
	p.drawReels = function() {
		var i, len = this.reelsData.length, reel;
		var symbolW = this.setup.symbolW;
		var reelMarginR = this.setup.reelMarginRight;

		for (i = 0; i < len; i++) {
			reel = new G.Reel();

			console.log('reelData:', i, this.reelsData[i]);

			reel.init(this.setup, this.signalDispatcher, this.symbolSprites, this.reelsData[i]);
			this.addChild(reel);
			reel.drawReel();
			this.reels.push(reel);
			reel.x = symbolW * i + reelMarginR * i;
		}
	};

	p.requestSpin = function() {
		console.log('requestSpin', this.spinRequested);
		if (this.spinRequested) {

			this.hammerSpin();

		} else {

			this.spinRequested = true;
			this.serverInterface.requestSpin();
		}
	};

	p.serverSpinStart = function(slotInitVo, spinResponseVO) {
		var reelStrips = slotInitVo.reelStrips;
		var stops = spinResponseVO.spinRecords[0].stops;

		console.log('serverSpinStart', stops);

		var stripData;
		var startIndex = 0;
		var endIndex = 0;
		var stopIndexes = [];
		var numSymbolsBefore = 8;
		var numSymbolsAfter = 9;
		var i, j, len = reelStrips.length, strip;
		for (i = 0; i < len; i++) {
			stripData = [];
			strip = reelStrips[i];
			var tempStop = stops[i] - numSymbolsBefore;
			var tempEnd = stops[i] + numSymbolsAfter;
			if (tempStop < 0) {
				startIndex = strip.length + tempStop;
				for (j = startIndex; j < strip.length; j++) {
					stripData.push(strip[j]);
				}

				for (j = 0; j < tempEnd; j++ ) {
					stripData.push(strip[j]);
				}
			} else {
				startIndex = tempStop;
			}

			if (tempEnd > strip.length) {
				startIndex = tempStop;
				endIndex = tempEnd - strip.length;
				for (j = startIndex; j < strip.length; j++) {
					stripData.push(strip[j]);
				}
				for (j = 0; j < endIndex; j++) {
					stripData.push(strip[j]);
				}
			} else {
				endIndex = tempEnd;
				for (j = startIndex; j < endIndex; j++) {
					stripData.push(strip[j]);
				}
			}

			this.reels[i].modifyReelData(stripData);
			stopIndexes.push(stops[i] - startIndex);
		}

		console.log('this.spinReels:', stopIndexes);

		this.spinReels(stopIndexes);
	};

	/**
	 * Spins all reels with a delay configuration from setup.json
	 * Stops reels if they are currently spinning.
	 * Clear any winline/animation overlays
	 * Play Spin Sound
	 * @method spinReels
	 */
	p.spinReels = function(indexes) {

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

		if (!indexes) {
			indexes = [0,0,0,0,0];
		}

		console.log('spinToIndex=', indexes);

		if (this.reelsSpinning === 0) {
			self.signalDispatcher.playSound.dispatch("spin1");
			//notify game components of a spin start
			this.signalDispatcher.reelSpinStart.dispatch();
			for (i = 0; i < len; i++)
			{
				delay = getDelay(i);
				reel = this.reels[i];
				reel.spinToIndex(indexes[i], delay);
				reel.reelSpinEnd.add(this.reelSpinEnd, this);
				this.reelsSpinning++;
			}
		}
	};

	/**
	 * @method hammerSpin
	 */
	p.hammerSpin = function() {
		var self = this;
		var reel, len = this.reels.length, i;

		for (i = 0; i < len; i++)
		{
			reel = this.reels[i];
			reel.scheduleFastStop();
		}

		setTimeout(function() {
				self.signalDispatcher.stopSound.dispatch("spin1");
			}, 200
		);

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
		console.log('reelSpinEnd', this.reelsSpinning);

		if (--this.reelsSpinning === 0)
		{
			this.spinRequested = false;
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
			self.updateSpinSpeed(newSpeed);
		});

		this.spinIndexEl = document.querySelector('#spinToIndex');

	};

	G.ReelsComponent = createjs.promote(ReelsComponent, "GameComponent");

})();