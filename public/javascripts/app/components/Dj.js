/*! kingkong 0.2.2 - 2015-03-02
 * Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function() {
    "use strict";

    /**
     * Dj controls sound. Sound begin, end, etc...
     *
     * @class Dj
     * @extends G.GameComponent
     * @constructor
     */
    var Dj = function() {
        this.GameComponent_constructor();
    };
    var p = createjs.extend(Dj, G.GameComponent);
    p.constructor = Dj;

	/**
	 *
	 * @type {boolean}
	 */
	p.isMuted = false;

    /**
     * @method init
     * @param setup
     * @param signalDispatcher
     */
    p.init = function(setup, signalDispatcher) {
        this.GameComponent_init(setup, signalDispatcher);
        this.signalDispatcher.playSound.add(this.playSound, this);
        this.signalDispatcher.stopSound.add(this.stopSound, this);
		this.isMuted = !setup.loadSounds;
    };

    p.nameDrop = function(name) {
        console.log("my homie " + name);
    };

    p.playSound = function(whatSound) {
		if (!this.isMuted) {
			console.log("playing this sound: " + whatSound);
			createjs.Sound.play(whatSound);
		}
    };
    
    p.stopSound = function(whatSound) {
		if (!this.isMuted) {
			console.log("stopping this sound: " + whatSound);
			createjs.Sound.stop(whatSound);
		}
    };

    G.Dj = createjs.promote(Dj, "GameComponent");

})();