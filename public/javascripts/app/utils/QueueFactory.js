/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Constructs queues for the CommandQueue for the purpose of displaying winning animations
	 *
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
	 * Generates a win animation accorind to gaffeType
	 * @method generateGaffe
	 * @param {String} gaffeType - the gaffe to generate a queue for
	 * @returns Array
	 */
	p.generateGaffe = function(gaffeType) {

		var queue = [], command, i, len;
		var winLines, bigWin, reels, symbolWins, particles, meter;

		reels = G.Utils.getGameComponentByClass(G.ReelsComponent);
		winLines = G.Utils.getGameComponentByClass(G.WinLinesComponent);
		bigWin = G.Utils.getGameComponentByClass(G.BigWinComponent);
		symbolWins = G.Utils.getGameComponentByClass(G.SymbolWinsComponent);
		particles = G.Utils.getGameComponentByClass(G.ParticlesComponent);
		meter = G.Utils.getGameComponentByClass(G.MeterComponent);

		console.log('generateGaffe=', gaffeType);


		switch(gaffeType) {
			case "normal" :
				reels.modifySymbolData(null, true);
				var bigWinCommand = new G.BigWinCommand();
				 bigWinCommand.init(this.setup);

				 var winLineCommand = new G.WinLineCommand();
				 winLineCommand.init(this.setup, [1,2,3,4,5]);
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

				symbolWins.playSpriteByRowCol(0, 0, "B1Loop__001");
				symbolWins.playSpriteByRowCol(1, 0, "D1intro__001");
				symbolWins.playSpriteByRowCol(2, 0, "D2intro__001");
				symbolWins.playSpriteByRowCol(3, 0, "F6intro__001");
				symbolWins.playSpriteByRowCol(4, 0, "D4intro__001");

				symbolWins.playSpriteByRowCol(0, 1, "F5intro__001");
				symbolWins.playSpriteByRowCol(1, 1, "M1intro__001");
				symbolWins.playSpriteByRowCol(2, 1, "F6intro__001");
				symbolWins.playSpriteByRowCol(3, 1, "M3intro__001");
				symbolWins.playSpriteByRowCol(4, 1, "F7intro__001");

				symbolWins.playSpriteByRowCol(0, 2, "D3intro__001");
				symbolWins.playSpriteByRowCol(1, 2, "F7intro__001");
				symbolWins.playSpriteByRowCol(2, 2, "WWintro__001_resume");
				symbolWins.playSpriteByRowCol(3, 2, "B2Intro__001_short");
				symbolWins.playSpriteByRowCol(4, 2, "D1intro__001_resume");


				// command = new G.SymbolAnimCommand();
				// command.init(this.setup, symbolWins, [1], 1, 'B1Intro__001');
				// command.callNextDelay = 0;
				// queue.push(command);

				// command = new G.SymbolAnimCommand();
				// command.init(this.setup, symbolWins, [7], 2, 'F6intro__001');
				// command.callNextDelay = 0;
				// queue.push(command);
				reels.visible = false;
				

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


				// command = new G.SymbolAnimCommand();
				// command.init(this.setup, [0,1,2], 5, 'm1-sprite__000', true);
				// queue.push(command);

				// command = new G.BigWinCommand();
				// command.init(this.setup, 5);
				// command.callNextDelay = 1200;
				// queue.push(command);


				// command = new G.BigWinCommand();
				// command.callNextDelay = 100;
				// command.init(this.setup, true);

				// command = new G.RemoveBigWinCommand();

command = new G.BigWinCommand();
command.init(this.setup, 5);
command.callNextDelay = 1200;

queue.push(command);
command = new G.RemoveBigWinCommand();
command.callNextDelay = 0;
command.init(this.setup);

				queue.push(command);


				var winLineIndexes = [];
				var winningLines = this.setup.winLines;
				len = winningLines.length;
				for (i = 0; i < len; i++) {
					winLineIndexes.push(i);
				}

				command = new G.WinLineCommand();
				command.init(this.setup, winLineIndexes, 0);
				queue.push(command);

				command = new G.FireworksCommand();
				command.init(this.setup, false, 10000);
				command.shouldLoop = true;
				queue.push(command);

				for (i = 0; i < winningLines.length; i++) {
					if (i > 0 && i % 10 === 0) {
						command = new G.FireworksCommand();
						command.init(this.setup, false, 10000);
						queue.push(command);
					}

					command = new G.WinLineCommand();
					command.init(this.setup, [i], 5, "M1", ["m1", "m1", "m1", "m1", "m1"], true);
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