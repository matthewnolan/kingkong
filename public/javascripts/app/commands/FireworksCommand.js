/*! kingkong 0.2.2 - 2015-02-26
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var FireworksCommand = function() {
		this.Command_constructor();
	};
	var p = createjs.extend(FireworksCommand, G.Command);
	p.constructor = FireworksCommand;

	p.shouldStopExisting = false;


	p.init = function(setup, gameComponent, shouldStopExisting) {
		this.Command_init(setup, gameComponent);

		this.callNextDelay = 0;
		this.shouldStopExisting = shouldStopExisting || this.shouldStopExisting;
	};

	p.execute = function() {

		if (this.shouldStopExisting) {
			this.gameComponent.smokeOff();
		} else {
			this.gameComponent.smokeOn();
		}


	};

	G.FireworksCommand = createjs.promote(FireworksCommand, "Command");

})();