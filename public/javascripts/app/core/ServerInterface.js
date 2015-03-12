/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	/**
	 * Makes calls to the Server and receives messages.  This class is passed to GameComponents which rely on user interaction that needs to notify the server.
	 * GameComponents which require to be notified of incoming server messages, should be passed the GameData Class and listen to signals dispatched from it.
	 * When plugging the application to an ElectoTank (or any other) Server, this is the only class which should need to change.
	 *
	 * @class ServerInterface
	 * @constructor
	 * @uses Fetch - https://github.com/github/fetch a cross browser polyfill for making REST api calls.
	 */
	var ServerInterface = function() {};
	var p = ServerInterface.prototype;
	p.constructor = ServerInterface;

	/**
	 * Signal Dispatcher is the core communication component of the application.  Ensure it is passed into any Class which might need to talk to another.
	 * In this context we can listen to gameData signals, and have the signalDispatcher dispatch a signal which can be listened to by GameComponents which require
	 * to be notified when some server data has been received.  Eg. ReelsComponent can spin the reels when a spin response is received.
	 *
	 * @property signalDispatcher
	 * @type {G.SignalDispatcher}
	 * @default null
	 */
	p.signalDispatcher = null;

	/**
	 * GameData is effectively the server application model.  All data returned by the server is stored in the GameData.
	 * GameData may also dispatch signals which we can use to provide hooks to the rest of the application via signalDispatcher.
	 *
	 * @property gameData
	 * @type {G.GameData}
	 * @default null
	 */
	p.gameData = null;

	/**
	 * init method stores passed in signalDispatcher and gameData.
	 * Signals which need to be handled by GameComponents should also be declared here.
	 *
	 * @method init
	 * @param {G.SignalDispatcher} signalDispatcher
	 * @param {G.GameData} gameData
	 */
	p.init = function(signalDispatcher, gameData) {
		this.signalDispatcher = signalDispatcher;
		this.signalDispatcher.serverSpinRequested.add(this.requestSpin, this);
		this.gameData = gameData;
		this.gameData.spinRequestCompleted.add(this.signalDispatcher.handleServerReelSpinStart, this);
	};


	/**
	 * Makes a REST call to the server api requesting a random spin result.
	 * GET: "/api/random-spin"
	 * Returns the spinResponse in JSON when completed and passes the result to GameData.
	 *
	 * @method requestSpin
	 */
	p.requestSpin = function() {
		var self = this;

		var success = function(json) {
			self.gameData.spinResponse(json);
		};

		var error = function(ex) {
			console.log('parsing failed', ex);
		};

		var response = function(res) {
			return res.json();
		};

		fetch('/api/random-spin')
			.then(response)
			.then(success)
			.catch(error);
	};

	/**
	 * Makes a REST api call to server requesting a slotInit response.
	 * GET: "/api/slot-init"
	 * Returns the slotInit in JSON when completed and passes the result to GameData.
	 *
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