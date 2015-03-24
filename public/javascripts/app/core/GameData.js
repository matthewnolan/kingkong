/*! kingkong 0.2.3 - 2015-03-05
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * GameData is our server model.
	 * It is mainly used by the ServerInterface to store returned server data.
	 * It also dispatches signals to notify GameComponents that some server data has returned.
	 * eg. ReelsComponent is notified when a slotResponse has been received in order to start the Reel spin animation.
	 *
	 * @class GameData
	 * @constructor
	 */
	var GameData = function() {};
	var p = GameData.prototype;
	p.constructor = GameData;

	/**
	 * Slot init response data is cached here
	 *
	 * @property slotInitData
	 * @todo create a data object to store data when core part finalised
	 * @see http://localhost:3000/api/slotInit for mock example
	 * @type {slotInitResponse}
	 * @default null
	 */
	p.slotInitResponseData = null;

	/**
	 * siganl dispatched when the slotInit response has been received.
	 *
	 * @property slotInitCompleted
	 * @type {Signal}
	 */
	p.slotInitCompleted = new signals.Signal();

	/**
	 * Where the last spin response is stored until the next one.
	 *
	 * @property spinRequestData
	 * @type {Object}
	 * @default null until first spin response received.
	 */
	p.spinResponseData = null;

	/**
	 * signal dispatched when a spinResponse arrives from server
	 *
	 * @property spinRequestCompleted
	 * @type {Signal}
	 */
	p.spinRequestCompleted = new signals.Signal();

	/**
	 * data from the slotInit response is passed here from the ServerInterface using this method.
	 * A slotInitCompleted signal is then dispatched
	 *
	 * @method slotInit
	 * @param {JSON} json - the slotInit response from the server
	 */
	p.slotInit = function(json) {
		this.slotInitResponseData = json;
		this.slotInitCompleted.dispatch(this.slotInitResponseData);
	};

	/**
	 * data from the spinResponse is passed here from the ServerInterface using this method.
	 * A spinRequestCompleted signal is then dispatched and handled by the ReelsComponent
	 *
	 * @method spinResponse
	 * @param {JSON} json - the spinResponse from the server
	 */
	p.spinResponse = function(json) {
		this.spinResponseData = json;
		this.spinRequestCompleted.dispatch(this.spinResponseData);
	};








	G.GameData = GameData;

})();