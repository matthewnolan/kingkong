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
	 * @property reelsData
	 * @type {null}
	 */
	p.reelsData = null;


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
	 * @deprecated
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
	 * This stores the last spin, and is dispatched with the reel complete
	 * to allow SignalDispatcher to evaluate any wins.
	 * @deprecated
	 * @type {Object}
	 * @default null
	 */
	p.spinResponse = null;

	/**
	 *
	 * @property slotInit
	 * @type {null}
	 */
	p.slotInitResponse = null;

	/**
	 * Prevent or allow spinning depending on if the Meter bet selector is showing
	 * @type {boolean}
	 */
	p.spinAllowed = true;

	/**
	 * initialises the reelsComponent with required game data and assets
	 *
	 * @method init
	 * @param {Object} setup - the setup json data object
	 * @param {G.SignalDispatcher} signalDispatcher - game's signal dispatcher used to dispatch signals to the rest of the application
	 * @param {G.ServerInterface} serverInterface - reference to the game's server interface required to make the spin request
	 * @param {createjs.SpriteSheet} symbolSprites - the createjs spritesheet data object required to pass to the createjs.SpriteSheet constructor
	 * @param {Object} slotInitResponse - the slot init response from the server.
	 */
	p.init = function(setup, signalDispatcher, serverInterface, symbolSprites, slotInitResponse) {
		this.GameComponent_init(setup, signalDispatcher);
		this.signalDispatcher.gaffeSpinRequested.add(this.handleGaffeSpinRequest, this);
		this.signalDispatcher.meterShelfOpened.add(this.handleMeterShelfOpened, this);
		this.signalDispatcher.meterShelfClosed.add(this.handleMeterShelfClosed, this);
		this.serverInterface = serverInterface;
		this.symbolSprites = symbolSprites;
		this.slotInitResponse = slotInitResponse;
		this.reelsData = this.getInitialStrips(this.slotInitResponse.reelStrips);
	};

	/**
	 * This function is necessary because the reelStrips arrays are so large, the spin animation cannot cope with animating such a
	 * large amount of symbols in one strip without serious lag (I've tried it!)
	 * (It's possible a blitted approach may get around this issue)
	 * For now the initial reelStrips are made up of n symbols cut from the reelStrips array during initialisation (n = setup.json variable cutLength)
	 * So we just take a slice from the initial stop value of the array and return the new reelStrips 2d array which we'll use to draw the reel symbols from.
	 *
	 * @method getInitialStrips
	 * @param reelStrips
	 * @returns {Array[]}
	 * @todo make stop value dynamic and set it to the initialStops inside slotInit
	 */
	p.getInitialStrips = function(reelStrips) {
		var i, len = reelStrips.length;
		var initialStop = 0;
		var temp = [];
		for (i = 0; i < len; i++) {
			temp.push(reelStrips[i].slice(initialStop, this.setup.reelAnimation.symbols.cutLength));
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
			reel.init(this.setup, this.signalDispatcher, this.symbolSprites, this.reelsData[i]);
			this.addChild(reel);
			reel.drawReel();
			this.reels.push(reel);
			reel.x = symbolW * i + reelMarginR * i;
		}
	};

	/**
	 * Gaffe spin requests handled by reelsComponent so that it knows a spin has been requested.
	 * Calls ServerInterface to make an api request for the gaffe (requestUrl)
	 *
	 * @method handleGaffSpinRequest
	 * @param requestUrl
	 */
	p.handleGaffeSpinRequest = function(requestUrl) {
		this.spinRequested = true;
		this.serverInterface.requestGaffeSpin(requestUrl);
	};

	p.handleMeterShelfOpened = function() {
		this.spinAllowed = false;
	};

	p.handleMeterShelfClosed = function() {
		this.spinAllowed = true;
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
		if(!this.spinAllowed) { return; }
		if (this.spinRequested) {
			console.log('requesting slam');
			this.slamSpin();

		} else {

			console.log('requesting spin');
			this.spinRequested = true;
			this.serverInterface.requestSpin();
		}
	};

	/**
	 * Reel Animations start here: configuration options are in setup.reelAnimation
	 * - 1. By default 10 symbols after and including the symbol at the stopIndex of the reelStrip are cut from the reelStrips array
	 * - 2. Existing symbols on the reels are switched to those symbols.  Switching takes place off the visible canvas after the first spin cycle,
	 * to give the existing symbols time to animate from the reels.
	 * - 3. If a symbolIndex in the reelStrip array equals the replacementId defined in the setup.json then a replacement is made based on the spinResponse.
	 * - 4. Starts the reels spinning and passes the correct symbol index to stop to
	 * See (G.Reel) for more info about how reel strips are drawn and animated.
	 *
	 * @method serverSpinStart
	 * @param {Object} spinResponse - the spin response containing the spinRecords and stops array
	 * @todo support a spinResponse which contains multiple spin records
	 */
	p.serverSpinStart = function(spinResponse) {

		console.log('serverSpin Start', spinResponse);
		//this.spinResponse = spinResponse;
		var reelStrips = this.slotInitResponse.reelStrips;
		//todo support multiple spin records
		var record = spinResponse.spinRecords[0];
		if (record.stops.length > 1) {
			console.warn("multiple spin records not yet supported");
		}

		var replacements = _.map(record.replacement, function(replacementStr) {
			return parseInt(replacementStr, 10);
		});

		console.log('replacement=', replacements);
		//todo support multiple spin records
		var stops = record.stops;
		var replacementId = this.setup.reelAnimation.symbols.replacement.index;
		var stripData;
		var startIndex = 0;
		var endIndex = 0;
		var stopIndexes = [];
		var numSymbolsBefore = this.setup.reelAnimation.symbols.stopVal;
		var numSymbolsAfter = this.setup.reelAnimation.symbols.cutLength - numSymbolsBefore;
		var i, j, len = reelStrips.length, strip;
		for (i = 0; i < len; i++) {
			stripData = [];
			strip = reelStrips[i];
			var tempStop = stops[i] - numSymbolsBefore;
			var tempEnd = stops[i] + numSymbolsAfter;
			if (tempStop < 0) {
				startIndex = strip.length + tempStop;
				for (j = startIndex; j < strip.length; j++) {
					if (strip[j] === replacementId) {
						stripData.push(replacements[i]);
					} else {
						stripData.push(strip[j]);
					}
				}
				for (j = 0; j < tempEnd; j++ ) {
					if (strip[j] === replacementId) {
						stripData.push(replacements[i]);
					} else {
						stripData.push(strip[j]);
					}
				}
			} else {
				startIndex = tempStop;
			}

			if (tempEnd > strip.length) {
				startIndex = tempStop;
				endIndex = tempEnd - strip.length;
				for (j = startIndex; j < strip.length; j++) {
					if (strip[j] === replacementId) {
						stripData.push(replacements[i]);
					} else {
						stripData.push(strip[j]);
					}
				}
				for (j = 0; j < endIndex; j++) {
					stripData.push(strip[j]);
				}
			} else {
				endIndex = tempEnd;
				for (j = startIndex; j < endIndex; j++) {
					if (strip[j] === replacementId) {
						stripData.push(replacements[i]);
					} else {
						stripData.push(strip[j]);
					}
				}
			}
			//this.cutSymbolIds = stripData;
			this.reels[i].modifyReelData(stripData);
			stopIndexes.push(numSymbolsBefore);
		}
		this.spinReels(stopIndexes);
	};

	/**
	 * Spins all reels with a delay configuration from setup.json
	 * Stops reels if they are currently spinning.
	 * Clear any winline/animation overlays
	 * Play Spin Sound
	 *
	 * @method spinReels
	 */
	p.spinReels = function(indexes) {

		console.log('spinReels', indexes);

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
	 * Schedules the reels to stop immediately
	 *
	 * @method slamSpin
	 */
	p.slamSpin = function() {
		console.warn('slammingSpin now');
		var reel, len = this.reels.length, i;

		for (i = 0; i < len; i++)
		{
			reel = this.reels[i];
			reel.scheduleFastStop();

		}
		this.signalDispatcher.stopSound.dispatch("spin1");

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
			this.signalDispatcher.reelSpinCompleted.dispatch();
			//
		}
	};

	/**
	 * For debugging purposes, provides a hook to update Reels' spinSpeed
	 *
	 * @method updateSpinSpeed
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

	G.ReelsComponent = createjs.promote(ReelsComponent, "GameComponent");

})();