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
	 * Set this flag to true if this command should remove a previously played big win
	 *
	 * @property shouldClearExisting
	 * @type {boolean}
	 * @default false
	 */
	p.shouldClearExisting = false;

	/**
	 * initialise command data and component
	 *
	 * @method init
	 * @param {Object} setup
	 * @param {G.GameComponent} gameComponent - the bigWinComponent is passed in so it can be called in execute
	 * @param {boolean} shouldClearExisting -
	 */
	p.init = function(setup, gameComponent, shouldClearExisting) {
		this.Command_init(setup, gameComponent);
		this.shouldClearExisting = shouldClearExisting;
	};

	/**
	 * Executes the command payload which in this case should either show or hide a BigWin animation
	 * @method execute
	 */
	p.execute = function() {
		if (this.shouldClearExisting) {
			this.gameComponent.hideAnimation();
		} else {
			this.gameComponent.playAnimation();
		}
	};

	G.BigWinCommand = createjs.promote(BigWinCommand, "Command");

})();