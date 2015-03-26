/*! kingkong 0.3.1 - 2015-03-23
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * This class is designed to handle spin responses, evaluate any win condition,
	 * and call any win animations necessary.
	 *
	 * @class SpinEvaluator
	 * @constructor
	 */
	var SpinEvaluator = function() {};
	var p = SpinEvaluator.prototype;
	p.constructor = SpinEvaluator;

	/**
	 * @property setup
	 * @type {Object}
	 * @default null
	 */
	p.setup = null;

	/**
	 * @property slotInit
	 * @type {Object}
	 */
	p.slotInit = null;

	/**
	 * @property signalDispatcher
	 * @type {G.SignalDispatcher}
	 * @default null
	 */
	p.signalDispatcher = null;

	/**
	 * Used here to prepare and run win animations.
	 *
	 * @property winAnimationQueue
	 * @type {G.CommandQueue}
	 * @default null
	 */
	p.winAnimationQueue = null;

	/**
	 * Initialise Class dependencies
	 * Create signal handlers related to win animation
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {G.SignalDispatcher} signalDispatcher
	 * @param {G.CommandQueue} commandQueue
	 * @param {Object} slotInit
	 */
	p.init = function(setup, signalDispatcher, commandQueue, slotInit) {
		this.setup = setup;
		this.signalDispatcher = signalDispatcher;
		this.winAnimationQueue = commandQueue;
		this.slotInit = slotInit;
		this.signalDispatcher.reelSpinCompleted.add(this.handleReelSpinComplete, this);
		this.signalDispatcher.spinResponseReceived.add(this.queueWinAnimation, this);
	};

	/**
	 * As soon as the spinRepsonse is returned, we are ready to queue up a win animation
	 * The win animation itself will play on "reelSpinCompleted" signal.
	 * The steps to queue the win animation as follows:
	 * 1. Use the spin response to test the number spinRecords received.
	 * @todo multiple spin records are not yet supported.
	 * 2. Use the reelStrips from the slotInit and the stops from the spinResponse to take a cut of symbolIds.
	 * This cut will contain the visible symbol indexes which the user will see when the spin has completed.
	 * 3. Get the number of visible symbolIndexes which equal the the replacement symbolIndex (defined in setup.json)
	 * 4. If this number === numReels * visible symbols per reel, then a big win anim should be queued.
	 * 5. Use the replacements array from spinResponse to decide which type of big win anim should play.
	 * eg. on a 5 strip x 3 symbol reel then 15 replacement symbolIndexes visible on the reel means a 3x5 win animation should play
	 *
	 * @method queueWinAnimation
	 * @param {Object} spinResponse
	 */
	p.queueWinAnimation = function(spinResponse) {

		console.warn('queueWinAnimation', spinResponse);

		var i, len, self = this;
		var commands = [];
		var isBigWin = false;
		var numRecords = spinResponse.spinRecords.length;
		if (numRecords > 1) {
			console.warn("multiple spin records is not supported yet");
		} else if (!numRecords) {
			throw "no spin record found";
		}

		var record = spinResponse.spinRecords[0];
		if (!record.wins.length) {
			return;
		}

		console.log('queueWinAnimation=', record);
		var reelStrips = this.slotInit.reelStrips;
		var symbolsPerReel = this.setup.symbolsPerReel;
		var replacementSymbolId = this.setup.reelAnimation.symbols.replacementId;
		var replacements = _.map(record.replacement, function(replacementStr) {
			return parseInt(replacementStr, 10);
		});
		console.log(reelStrips);
		len = reelStrips.length;
		var visibleSymbolIndexes = [];
		var pushSymbol = function(symbolIndex) {
			visibleSymbolIndexes.push(symbolIndex);
		};
		for (i = 0; i < len; i++) {
			var stopIndex = record.stops[i];
			var vStrip = reelStrips[i].slice(stopIndex, stopIndex + symbolsPerReel);
			_.each(vStrip, pushSymbol);
		}
		console.log('visibleSymbolIndexes', visibleSymbolIndexes);
		var maxSymbolsNum = visibleSymbolIndexes.length;
		var winningSymbols = _.filter(visibleSymbolIndexes, function(symbolIndex) {
			return symbolIndex === replacementSymbolId;
		});

		var command;
		var paylineIndexes = [];
		var spriteSymbolMap = this.setup.reelAnimation.symbols.spriteMap;

		if (winningSymbols.length === maxSymbolsNum) {
			console.warn("Big Win Anim: ", replacements);
			isBigWin = true;
			var winningItems = _.filter(replacements, function(symbolIndex) {
				return symbolIndex === replacements[0];
			});

			console.log("winningItemsLen=", winningItems.length);
			switch(winningItems.length) {
				case 5 :
					console.log('play 3x5 win anim typeId=', winningItems[0]);
					break;
				case 4 :
					console.log('play 3x4 win anim typeId=', winningItems[0]);
					break;
				case 3 :
					console.log('play 3x4 win anim typeId=', winningItems[0]);
					break;
				default :
					throw "big win anim error, not enough replacements for big win: " + winningItems.length + " should be greater than 2";
			}
		}

		var generateCommandData = function(win, i) {
			// todo get label from winning type
			var animId = spriteSymbolMap[win.winningType].toLowerCase() + "intro__001";
			paylineIndexes.push(win.paylineIndex);
			var numWins = self.getNumWinsOnPayline(win.paylineIndex, record.stops, win.winningType);
			command = new G.WinLineCommand();
			command.init(self.setup, [win.paylineIndex], numWins, animId);
			if (i===0) {
				command.loopIndex = 1;
			}
			command.callNextDelay = 3000;
			commands.push(command);
		};

		_.each(record.wins, generateCommandData);

		if (record.wins.length) {
			command = new G.WinLineCommand();
			command.init(this.setup, paylineIndexes, 0);
			commands.unshift(command);
		}
		this.winAnimationQueue.setupQueue(commands);
	};

	/**
	 * @method getNumWinsOnPayline
	 * @param paylineIndex
	 * @param stops
	 * @param winningType
	 * @returns {*}
	 */
	p.getNumWinsOnPayline = function(paylineIndex, stops, winningType) {
		var symbolData = this.getSymbolDataOnPayline(paylineIndex, stops);
		return _.filter(symbolData, function(data) {
			return data.winType === winningType;
		}).length;
	};

	/**
	 * @method getSymbolLabelsOnPayline
	 * @param paylineIndex
	 * @param stops
	 * @returns {Array}
	 *
	 */
	p.getSymbolIndexesOnPayline = function(paylineIndex, stops) {
		var payline = this.setup.winLines[paylineIndex].data;
		var reelStrips = this.slotInit.reelStrips;
		return _.map(reelStrips, function(strip, i) {
			return strip[stops[i] + payline[i]];
		});
	};

	p.getSymbolDataOnPayline = function(paylineIndex, stops) {
		var indexesOnPayline = this.getSymbolIndexesOnPayline(paylineIndex, stops);
		var symbolsData = this.setup.reelAnimation.symbols.data;
		return _.map(indexesOnPayline, function(index) {
			return symbolsData[index];
		});
	};



	/**
	 * Dispatched by ReelsComponent when the reel spin stops.
	 * Here we can setup any necessary win animations, and update the meter.
	 *
	 * @method handleReeSpinComplete
	 */
	p.handleReelSpinComplete = function() {
		console.log('handleReelSpinComplete', this.winAnimationQueue.gaffType);
		this.winAnimationQueue.play();
		//allow client side gaffs:
		if (this.winAnimationQueue.gaffType.indexOf('client') >= 0) {
			this.doClientSideGaff();
		}
	};

	/**
	 * @method doClientSideGaff
	 */
	p.doClientSideGaff = function() {
		var gaffMenu = G.Utils.getGameComponentByClass(G.GaffMenuComponent);
		gaffMenu.deselectGaffButtons();
		var meter = G.Utils.getGameComponentByClass(G.MeterComponent);
		meter.checkMockWin();
	};



	G.SpinEvaluator = SpinEvaluator;

})();