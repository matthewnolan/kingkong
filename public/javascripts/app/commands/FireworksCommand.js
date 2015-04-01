/*! kingkong 0.2.2 - 2015-02-26
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Command responsible for launching a 'Firework' particle animation.
	 *
	 * @todo remove shouldStopExisting functionality, component should only handle it based on animationDuration.
	 * @class FireworksCommand
	 * @constructor
	 */
	var FireworksCommand = function() {
		this.Command_constructor();
	};
	var p = createjs.extend(FireworksCommand, G.Command);
	p.constructor = FireworksCommand;

	/**
	 * @property shouldStopExisting
	 * @type {boolean}
	 */
	p.shouldStopExisting = false;

	/**
	 * Default animation duration
	 *
	 * @property animationDuration
	 * @type {number}
	 */
	p.animationDuration = 6000;

	/**
	 * Defines firework particle animation data
	 *
	 * @methd init
	 * @param setup
	 * @param shouldStopExisting
	 * @param animationDuration
	 */
	p.init = function(setup, shouldStopExisting, animationDuration) {
		this.Command_init(setup);
		this.callNextDelay = 0;
		this.shouldStopExisting = shouldStopExisting || this.shouldStopExisting;
		this.animationDuration = animationDuration || this.animationDuration;
	};

	/**
	 * Play the firework particle animation
	 *
	 * @method execute
	 */
	p.execute = function() {
		var particlesComponent = G.Utils.getGameComponentByClass(G.ParticlesComponent);
		if (this.shouldStopExisting) {
			particlesComponent.smokeOff();
		} else {
			particlesComponent.smokeOn(this.animationDuration);
		}
	};

	G.FireworksCommand = createjs.promote(FireworksCommand, "Command");

})();