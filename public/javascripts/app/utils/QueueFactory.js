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
	 */
	p.init = function(setup) {
		this.setup = setup;
	};

	/**
	 * Generates a win animation accorind to gaffType
	 * @method generateGaff
	 * @param {String} gaffType - the gaff to generate a queue for
	 * @returns Array
	 */
	p.generateGaff = function(gaffType) {

		var queue = [], command, i, len;
		var winLines, bigWin, reels, symbolWins, particles, meter;

		reels = G.Utils.getGameComponentByClass(G.ReelsComponent);
		winLines = G.Utils.getGameComponentByClass(G.WinLinesComponent);
		bigWin = G.Utils.getGameComponentByClass(G.BigWinComponent);
		symbolWins = G.Utils.getGameComponentByClass(G.SymbolWinsComponent);
		particles = G.Utils.getGameComponentByClass(G.ParticlesComponent);
		meter = G.Utils.getGameComponentByClass(G.MeterComponent);

		console.log('generateGaff=', gaffType);


		switch(gaffType) {
			case "normal" :
				reels.modifySymbolData(null, true);
				var bigWinCommand = new G.BigWinCommand();
				 bigWinCommand.init(this.setup, bigWin);

				 var winLineCommand = new G.WinLineCommand();
				 winLineCommand.init(this.setup, winLines, [1,2,3,4,5]);
				 queue.push(winLineCommand);
				break;
			case "client_lotsOfWin" :
				command = new G.CustomCommand();
				// command.init(this.setup, symbolWins, [1], 1, 'B1Intro__001');
				// command.callNextDelay = 0;
				// command.loopIndex = 1;				
				queue.push(command);

				// command = new G.SymbolAnimCommand();	
				// command.init(this.setup, symbolWins, [7], 1, 'F6intro__001');
				// command.callNextDelay = 0;
				// queue.push(command);

				symbolWins.playBySpriteByRowCol(0, 0, "B1Loop__001");
				symbolWins.playBySpriteByRowCol(1, 0, "D1intro__001");
				symbolWins.playBySpriteByRowCol(2, 0, "D2intro__001");
				symbolWins.playBySpriteByRowCol(3, 0, "F6intro__001");
				symbolWins.playBySpriteByRowCol(4, 0, "D4intro__001");

				symbolWins.playBySpriteByRowCol(0, 1, "F5intro__001");
				symbolWins.playBySpriteByRowCol(1, 1, "M1intro__001");
				symbolWins.playBySpriteByRowCol(2, 1, "F6intro__001");
				symbolWins.playBySpriteByRowCol(3, 1, "M3intro__001");
				symbolWins.playBySpriteByRowCol(4, 1, "F7intro__001");

				symbolWins.playBySpriteByRowCol(0, 2, "D3intro__001");
				symbolWins.playBySpriteByRowCol(1, 2, "F7intro__001");
				symbolWins.playBySpriteByRowCol(2, 2, "WWintro__001_resume");
				symbolWins.playBySpriteByRowCol(3, 2, "B2Intro__001_short");
				symbolWins.playBySpriteByRowCol(4, 2, "D1intro__001_resume");


				// command = new G.SymbolAnimCommand();
				// command.init(this.setup, symbolWins, [1], 1, 'B1Intro__001');
				// command.callNextDelay = 0;
				// queue.push(command);

				// command = new G.SymbolAnimCommand();
				// command.init(this.setup, symbolWins, [7], 2, 'F6intro__001');
				// command.callNextDelay = 0;
				// queue.push(command);

				break;
			case "client_Line_M1" :
				var numSymbolsPerReel = this.setup.reelAnimation.symbols.cutLength;
				var modifySymbols = [];
				for (i = 0; i < numSymbolsPerReel; i++)
				{
					modifySymbols.push(1);
				}

				reels.modifySymbolData(modifySymbols);
				meter.prepareMockWin(this.setup.defaultBigWin);

				command = new G.SymbolAnimCommand();
				command.init(this.setup, symbolWins, [0,1,2], 5, 'M1intro__001_short');
				command.callNextDelay = 500;
				queue.push(command);

				command = new G.BigWinCommand();
				command.callNextDelay = 1200;
				command.init(this.setup, bigWin);

				queue.push(command);

				command = new G.BigWinCommand();
				command.callNextDelay = 0;
				command.init(this.setup, bigWin,true);

				queue.push(command);

				command = new G.SymbolAnimCommand();
				command.init(this.setup, symbolWins, [0,1,2], 5, 'M1intro__001_resume');
				queue.push(command);

				var winLineIndexes = [];
				var winningLines = this.setup.winLines;
				len = winningLines.length;
				for (i = 0; i < len; i++) {
					winLineIndexes.push(i);
				}

				command = new G.WinLineCommand();
				command.init(this.setup, winLines, winLineIndexes, 0);
				queue.push(command);

				command = new G.FireworksCommand();
				command.init(this.setup, particles, false, 10000);
				command.loopIndex = 1;
				queue.push(command);

				for (i = 0; i < winningLines.length; i++) {
					if (i > 0 && i % 10 === 0) {
						command = new G.FireworksCommand();
						command.init(this.setup, particles, false, 10000);
						queue.push(command);
					}

					command = new G.WinLineCommand();
					command.init(this.setup, winLines, [i], 5, "M1intro__001");
					queue.push(command);
				}
				break;
			default :

				break;
		}

		return queue;

	};






	G.QueueFactory = QueueFactory;

})();