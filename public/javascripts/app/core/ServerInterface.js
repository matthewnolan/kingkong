/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	/**
	 * Makes calls to the Server and receives messages.  It then calls the signal dispatcher to dispatch necessary events to GameComponents
	 * @class ServerInterface
	 * @constructor
	 */
	var ServerInterface = function() {};
	var p = ServerInterface.prototype;
	p.constructor = ServerInterface;

	/**
	 * @property signalDispatcher
	 * @type {G.SignalDispatcher}
	 */
	p.signalDispatcher = null;

	/**
	 * @method init
	 * @param signalDispatcher
	 */
	p.init = function(signalDispatcher) {
		this.signalDispatcher = signalDispatcher;
	};

	G.ServerInterface = ServerInterface;

})();