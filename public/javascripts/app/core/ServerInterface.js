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
	 * @default null
	 */
	p.signalDispatcher = null;

	/**
	 * @property gameData
	 * @type {G.GameData}
	 * @default null
	 */
	p.gameData = null;


	/**
	 * init method stores passed in signalDispatcher and gameData
	 *
	 * @method init
	 * @param {G.SignalDispatcher} signalDispatcher
	 * @param {G.GameData} gameData
	 */
	p.init = function(signalDispatcher, gameData) {
		this.signalDispatcher = signalDispatcher;
		this.gameData = gameData;
	};

	/**
	 * Sends a requestInit command to the server
	 * @method requestInit
	 */
	p.requestSlotInit = function() {
		var self = this;

		var success = function(json) {
			self.gameData.slotInit(json);
		};

		var error = function(ex) {
			console.log('parsing failed', ex);
		};

		var response = function(res) {
			return res.json();
		};

		fetch('/api/slot-init')
			.then(response)
			.then(success)
			.catch(error);
	};



	G.ServerInterface = ServerInterface;

})();