/*! kingkong 0.1.2 - 2015-02-13
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * @class Utils
	 * @static
	 */
	var Utils = {};

	/**
	 * @property gameComponents
	 * @type {G.GameComponent[]}
	 */
	Utils.gameComponents = [];

	/**
	 * Access value the app is currently scaled to.
	 * It is modified when the app is rescaled.
	 * @property currentScale
	 * @type {number}
	 */
	Utils.currentScale = 1;

	/**
	 * Wrapper function useful for allowing setTimeout to be used inside loops
	 * method callLater
	 * @param func
	 * @param args
	 * @param scope
	 * @param ms
	 */
	Utils.callLater = function(func, args, scope, ms) {
		setTimeout(function() {
			func.apply(scope, args);
		}, ms);
	};

	/**
	 * @ method getGameComponentByClass - pass the type of component {eg. G.ReelsComponent} to return the component instance
	 * @param {class} componentClass - must be the class type of a G.GameComponent
	 * @returns {G.GameComponent} - the instance
	 */
	Utils.getGameComponentByClass = function (componentClass) {
		return _.find(Utils.gameComponents, function(component) {
			return component instanceof componentClass;
		});
	};






	G.Utils = Utils;

})();