/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Command will remove a playing big win animation
	 *
	 * @deprecated
	 * @class G.BigWinCommand
	 * @extends G.Command
	 * @constructor
	 */
	var RemoveBigWinCommand = function() {
		this.Command_constructor();
	};
	var p = createjs.extend(RemoveBigWinCommand, G.Command);
	p.constructor = RemoveBigWinCommand;


	/**
	 * initialise command data and component
	 *
	 */
	p.init = function() {

	};

	/**
	 * Executes the command payload which in this case should either show or hide a BigWin animation
	 * @method execute
	 */
	p.execute = function() {
		var bigWinComponent = G.Utils.getGameComponentByClass(G.BigWinComponent);
		bigWinComponent.hideAnimation();
	};

	G.RemoveBigWinCommand = createjs.promote(RemoveBigWinCommand, "Command");

})();