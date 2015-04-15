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
	 *
	 * @type {string}
	 */
	p.animationFrameLabel = "";

	/**
	 * initialise command data and component
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {number} animationType
	 * @param {string} animationFrameLabel
	 */
	p.init = function(setup, animationType, animationFrameLabel) {
		this.Command_init(setup);
		this.animationType = animationType;
		this.animationFrameLabel = animationFrameLabel;
	};

	/**
	 * Play a Big Win Animation
	 *
	 *
	 * @method execute
	 */
	p.execute = function() {
		var bigWinComponent = G.Utils.getGameComponentByClass(G.BigWinComponent);
		bigWinComponent.playAnimation(this.animationType, this.animationFrameLabel, "m1intro__001");
	};

	G.BigWinCommand = createjs.promote(BigWinCommand, "Command");

})();