/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var SymbolAnimCommand = function() {
		this.Command_constructor();
	};
	var p = createjs.extend(SymbolAnimCommand, G.Command);
	p.constructor = SymbolAnimCommand;


	/**
	 * @property data
	 * @type {Object}
	 */
	p.data = null;

	/**
	 *
	 * @param {Object} setup
	 * @param {G.WinLinesComponent} gameComponent
	 * @param {Object} data
	 */
	p.init = function(setup, gameComponent, data) {
		this.Command_init(setup, gameComponent);
		this.data = data || this.data;
	};

	/**
	 * Hide Previously drawn winLines and show more winLines.
	 * @method execute
	 */
	p.execute = function() {

	};

	G.SymbolAnimCommand = createjs.promote(SymbolAnimCommand, "Command");

})();