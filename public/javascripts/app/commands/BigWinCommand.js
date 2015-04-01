/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Command will prepare a big win animation and begin the animation on execute or hide a big win animation which is already playing.
	 *
	 * @class G.BigWinCommand
	 * @extends G.Command
	 * @constructor
	 */
	var BigWinCommand = function() {
		this.Command_constructor();
	};
	var p = createjs.extend(BigWinCommand, G.Command);
	p.constructor = BigWinCommand;

	/**
	 * Defines the big win animation type to play
	 *
	 * - 3: 3x3 big win
	 * - 4: 3x4 big win
	 * - 5: 3x5 big win
	 *
	 * @property animationType
	 * @type {number}
	 */
	p.animationType = 0;

	/**
	 * initialise command data and component
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {number} animationType
	 */
	p.init = function(setup, animationType) {
		this.Command_init(setup);
		this.animationType = animationType;
	};

	/**
	 * Executes the command payload which in this case should either show or hide a BigWin animation
	 * @method execute
	 */
	p.execute = function() {
		var bigWinComponent = G.Utils.getGameComponentByClass(G.BigWinComponent);
		bigWinComponent.playAnimation(this.animationType);
	};

	G.BigWinCommand = createjs.promote(BigWinCommand, "Command");

})();