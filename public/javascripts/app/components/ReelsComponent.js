/*! kingkong 0.0.1 - 2015-02-03
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * GameComponent responsible for creating the G.Reels (ReelStrips) drawing symbols to each reel and launching the spin animation on them.
	 * This class makes spinRequests via the serverInterface, and handles the responses by updating the reels according the to the
	 * stops array.
	 * It also dispatches a signalDispatcher.reelSpinComplete signal when all reel animations have completed
	 *
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
	 * the createjs spritesheet data object required to pass to the createjs.SpriteSheet constructor in order to draw the symbols.
	 * This is passed from Game during initialisation.
	 *
	 * @property symbolSprites
	 * @type {Object}
	 */
	p.symbolSprites = null;

	/**
	 * These are the default symbols drawn to the reels.
	 * This may need to be created from the slotInit response at some point.
	 *
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
	 * Container for the G.Reel sub components, 1 per reel.
	 *
	 * @property reels
	 * @type {G.Reel[]}
	 */
	p.reels = [];

	/**
	 * Setup contains a map array of all the symbol names. eg. 'ww', 'm1'. These are stored in the array at the index of the symbolId.
	 * That way we can draw the correct symbols according to reelStrips data array, which is an array of symbolIds.
	 *
	 * @property reelMap
	 * @type {Object}
	 */
	p.reelMap = null;

	/**
	 * Keeps a count of the number of reels which are currenlty animating.  When a reel dispatches it's complete signal, this number is
	 * reduced.  When the number of reels spinning becomes 0 this component can fire it's reelsSpinComplete signal via the signalDispatcher.
	 *
	 * @property reelsSpinning
	 * @type {number}
	 */
	p.reelsSpinning = 0;

	/**
	 * If a spinRequest has been made to the server we do not want to make another spin request.  Instead, we would like
	 * to hammer the reels to stop.
	 *
	 * @property spinRequested
	 * @type {boolean}
	 */
	p.spinRequested = false;

	/**
	 * The ServerInterface is required here to make spin Requests.
	 *
	 * @property serverInterface
	 * @type {G.ServerInterface}
	 */
	p.serverInterface = null;

	/**
	 * initialises the reelsComponent with required game data and assets
	 *
	 * @method init
	 * @param {Object} setup - the setup json data object
	 * @param {G.SignalDispatcher} signalDispatcher - game's signal dispatcher used to dispatch signals to the rest of the application
	 * @param {G.ServerInterface} serverInterface - reference to the game's server interface required to make the spin request
	 * @param {Object} symbolSprites - the createjs spritesheet data object required to pass to the createjs.SpriteSheet constructor
	 * @param {Array[]} reelsData
	 */
	p.init = function(setup, signalDispatcher, serverInterface, symbolSprites, reelsData) {
		this.GameComponent_init(setup, signalDispatcher);
		this.reelsMap = setup.reelMap;
		this.serverInterface = serverInterface;
		this.symbolSprites = symbolSprites;

		if (reelsData) {
			this.reelsData = this.getInitialStrips(reelsData);
		} else {

		}

		var i, len = this.reelsData.length;
		if (setup.reelAnimation.shuffleReels) {
			for (i = 0; i < len; i++) {
				//G.Utils.shuffle(this.reelsData[i]);
			}
		}
		this.initDomEvents();
	};

	p.getInitialStrips = function(reelStrips) {
		var i, len = reelStrips.length;
		var temp = [];
		for (i = 0; i < len; i++) {
			temp.push(reelStrips[i].slice(0, 17));
		}
		return temp;
	};

	/**
	 * Takes an array of symbol ID's and passes them to each reel to modify symbol sprites at runtime on each reel
	 * This is usually only done when the spin request server response has returned the stop positions, but can also be used
	 * for calling and debugging win animations.
	 *
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
	 * Creates and initialises each reelstrip, and draws them to the display.
	 *
	 * @method drawReels
	 */
	p.drawReels = function() {
		var i, len = this.reelsData.length, reel;
		var symbolW = this.setup.symbolW;
		var reelMarginR = this.setup.reelMarginRight;

		for (i = 0; i < len; i++) {
			reel = new G.Reel();

			// console.log('reelData:', i, this.reelsData[i]);

			reel.init(this.setup, this.signalDispatcher, this.symbolSprites, this.reelsData[i]);
			this.addChild(reel);
			reel.drawReel();
			this.reels.push(reel);
			reel.x = symbolW * i + reelMarginR * i;
		}
	};

	/**
	 * requestSpin is called every time the user initiates a spin (either via the keyboard or swipe to spin gesture on touch devices)
	 * If spinRequest has not yet been made (ie the reels are stopped) then this makes a serverInterface.requestSpin call, and the spinRequest flag
	 * is set to true.
	 * Otherwise we slam the reels to stop them.
	 * @todo: the duration of time after spinning before a user can slam the reels need to be configurable via the setup file, as some regions require a cool-down period between spins.
	 *
	 * @method requestSpin
	 */
	p.requestSpin = function() {
		if (this.spinRequested) {

			this.hammerSpin();

		} else {

			this.spinRequested = true;
			this.serverInterface.requestSpin();
		}
	};

	/**
	 * 1. modifies the reelstrips off canvas, so that the next spin contains the correct symbols to stop to, it modifies (by default) 8 symbols before the stop symbol
	 * and 8 symbols after the symbol to make up the total number of symbols on each reel strip. (by default 17).
	 * 2. Starts the reels spinning and passes the correct symbol index to stop to (which should always be a fixed number based on the number of symbols before the stop.
	 * eg. If 8 symbols are stuffed before the stop symbol, then reels must tween to symbol index 8 in order to stop at the correct symbol.
	 * See (G.Reel) for info about how reel strips are created and animated.
	 *
	 * @method serverSpinStart
	 * @param {Object} slotInitVo - the slot init response from the server, containing the reelStrips array.
	 * @param {Object} spinResponseVO - the spin response containing the spinRecords and stops array
	 * @todo initialise slotInitVo during init method, because it only needs to be passed in once.
	 */
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
			stopIndexes.push(numSymbolsBefore);
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
	 *
	 *
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
	 * Signal handler called when reel.reelSpinEnd is dispatched.  When all reels have finished
	 * this method dispatches the signalDispatcher.reelSpinComplete signal.
	 *
	 * @method reelSpinEnd
	 */
	p.reelSpinEnd = function() {
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
	};

	G.ReelsComponent = createjs.promote(ReelsComponent, "GameComponent");

})();