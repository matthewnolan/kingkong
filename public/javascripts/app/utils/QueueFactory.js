/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Constructs queues for the CommandQueue for the purpose of displaying winning animations
	 * @class QueueFactory
	 * @constructor
	 */
	var QueueFactory = function() {};
	var p = QueueFactory.prototype;
	p.constructor = QueueFactory;


	/**
	 * Saves reference to Setup and GameComponents
	 * @method init
	 * @param {Object} setup
	 * @param {G.GameComponent[]} gameComponents
	 */
	p.init = function(setup, gameComponents) {
		this.setup = setup;
		this.gameComponents = gameComponents;
	};

	/**
	 * Generates a win animation accorind to gaffType
	 * @method generateGaff
	 * @param {String} gaffType - the gaff to generate a queue for
	 * @returns Array
	 */
	p.generateGaff = function(gaffType) {

		var queue = [];

		var winLines, bigWin, reels;

		reels = G.Utils.getGameComponentByClass(G.ReelsComponent);
		winLines = G.Utils.getGameComponentByClass(G.WinLinesComponent);
		bigWin = G.Utils.getGameComponentByClass(G.BigWinComponent);

		switch(gaffType) {
			case "normal" :
				reels.modifySymbolData(null, true);
				var bigWinCommand = new G.BigWinCommand();
				 bigWinCommand.init(this.setup, bigWin);

				 var winLineCommand = new G.WinLineCommand();
				 winLineCommand.init(this.setup, winLines, [1,2,3,4,5]);
				 queue.push(winLineCommand);
				break;
			case "lotsOfWin" :

				break;
			case "gaff_Line_M1" :
				reels.modifySymbolData();


				break;
			default :

				break;
		}

		return queue;

	};






	G.QueueFactory = QueueFactory;

})();