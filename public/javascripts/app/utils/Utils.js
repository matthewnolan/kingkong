/*! kingkong 0.1.2 - 2015-02-13
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * Utility methods and properties commonly used around the application.
	 * GameComponents are stored here.
	 * Canvas scale is stored here.
	 * Please be aware that application code has global access to this class, because it is static. So don't go crazy.
	 *
	 * @class Utils
	 * @static
	 */
	var Utils = {};

	/**
	 * Initial Utils setup: for now just parse the queryString into global params object
	 *
	 * @method Utils.init
	 */
	Utils.init = function() {
		Utils.parseQueryString();
		Utils.parseClientServerObj();
	};

	/**
	 * Array container for all GameComponents.
	 * GameComponents should automatically add themselves to the gameComponents array during init (when their init super is called).
	 *
	 * @property gameComponents
	 * @type {G.GameComponent[]}
	 */
	Utils.gameComponents = [];

	/**
	 * Access value the app is currently scaled to.
	 * It is modified when the app is rescaled.
	 *
	 * @property currentScale
	 * @type {number}
	 */
	Utils.currentScale = 1;

	/**
	 * Global object to store queryString parameters
	 *
	 * @type {{}}
	 */
	Utils.params = {};


	/**
	 * Global object to store enviroment vars passed from express 
	 *
	 * @type {{}}
	 */
	Utils.serverParams = {};

	/**
	 * Pass the fully qualified class name of component {eg. G.ReelsComponent} to return the component instance.
	 *
	 * @method getGameComponentByClass -
	 * @param {class} componentClass - must be the class type of a G.GameComponent
	 * @returns {G.GameComponent} - the instance
	 */
	Utils.getGameComponentByClass = function (componentClass) {
		return _.find(Utils.gameComponents, function(component) {
			return component instanceof componentClass;
		});
	};

	/**
	 * Wrapper function useful for allowing setTimeout to be used inside loops where creating new functions is inefficient
	 * method callLater
	 *
	 * @param func - function to be called later
	 * @param args - arguments to pass to func
	 * @param scope - scope for function call (eg. pass this if required)
	 * @param ms - millis til function call (may pass 0 to delay a function call to next execution cycle)
	 */
	Utils.callLater = function(func, args, scope, ms) {
		setTimeout(function() {
			func.apply(scope, args);
		}, ms);
	};

	/**
	 * Shuffles elements of an array randomly and returns the new array
	 *
	 * @method shuffle
	 * @param arr - array to be shuffled
	 * @returns {[]} shuffled array
	 */
	Utils.shuffle = function(arr) {
		var currentIndex = arr.length, temporaryValue, randomIndex ;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			temporaryValue = arr[currentIndex];
			arr[currentIndex] = arr[randomIndex];
			arr[randomIndex] = temporaryValue;
		}
		return arr;
	};

	/**
	 * Creates a global object params based on queryString parameters.
	 *
	 * @method parseQueryString
	 *
	 */
	Utils.parseQueryString = function() {
		var queryString = window.location.search;
		queryString = queryString.substring(1);

		var params = {}, queries, temp, i, l;

		// Split into key/value pairs
		queries = queryString.split("&");

		// Convert the array of strings into an object
		for ( i = 0, l = queries.length; i < l; i++ ) {
			temp = queries[i].split('=');
			params[temp[0]] = temp[1];
		}

		G.Utils.params = params;
	};


	Utils.parseClientServerObj = function() {
		// clientServer should be a var sitting in the global space, located in index.htm
		var clientServer = clientServer || null;
		if (typeof clientServer === null) {
			return false;
		}
		var serverParams = {};

		for (var prop in clientServer) {
			serverParams[prop] = clientServer[prop];
		}

		G.Utils.serverParams = serverParams;
	};


	G.Utils = Utils;

})();