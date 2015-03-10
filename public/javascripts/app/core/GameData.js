/*! kingkong 0.2.3 - 2015-03-05
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var GameData = function() {};
	var p = GameData.prototype;
	p.constructor = GameData;

	/**
	 * Slot init response data is held here
	 * @property slotInitVO
	 * @todo create a VO to store data when core part finalised
	 * @see http://localhost:3000/api/slotInit for mock example
	 * @type {slotInitVO}
	 */
	p.slotInitVO = null;

	/**
	 * Dispatched when slot init received from server
	 *
	 * @property slotInitCompleted
	 * @signal
	 * @type {Signal}
	 */
	p.slotInitCompleted = new signals.Signal();

	/**
	 *
	 * @type {null}
	 */
	p.spinRequestVO = null;

	/**
	 *
	 * @type {Signal}
	 */
	p.spinRequestCompleted = new signals.Signal();


	/**
	 *
	 * @type {null}
	 */
	p.slotInit = function(json) {
		this.slotInitVO = json;
		this.slotInitCompleted.dispatch();
	};

	/**
	 *
	 * @param json
	 */
	p.spinResponse = function(json) {
		this.spinRequestVO = json;
		this.spinRequestCompleted.dispatch(this.slotInitVO, this.spinRequestVO);
	};








	G.GameData = GameData;

})();