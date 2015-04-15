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
	 * If set to true, don't play any app sounds
	 *
	 * @property isMuted
	 * @type {boolean}
	 */
	p.isMuted = false;

    /**
	 * initialise component and signal handling
	 *
     * @method init
     * @param setup
     * @param signalDispatcher
     */
    p.init = function(setup, signalDispatcher) {
        this.GameComponent_init(setup, signalDispatcher);
        this.signalDispatcher.playSound.add(this.playSound, this);
        this.signalDispatcher.stopSound.add(this.stopSound, this);
		this.isMuted = !setup.loadSounds;


		// var txt;
		// var r = confirm("Press a button!");
		// if (r == true) {
		//     txt = "You pressed OK!";
		//     createjs.Sound.play("reelstop1");
		// } else {
		//     txt = "You pressed Cancel!";
		// }
		// console.log(txt);

        var mainModal = document.getElementById('mainModal');
        var mainText = document.getElementById('mainText');
        mainModal.style.display = 'block';
        var modalEvent = new Hammer(mainModal);
        modalEvent.on("tap", function(ev) {
            createjs.Sound.play("reelstop1");
            mainModal.style.display = 'none';
        });
        mainText.innerHTML = "Just Swipe to spin ok??";		

    };

	/**
	 * Plays a sound if not muted
	 *
	 * @method playSound
	 * @param {string} whatSound sound name as defined in setup.json sounds manifest
	 */
    p.playSound = function(whatSound) {
		if (!this.isMuted) {
			console.log("playing this sound: " + whatSound);
			createjs.Sound.play(whatSound);
		}
    };

	/**
	 * Stops a playing sound
	 *
	 * @method stopSound
	 * @param whatSound
	 */
    p.stopSound = function(whatSound) {
		console.log("stopping this sound: " + whatSound);
		createjs.Sound.stop(whatSound);
    };

    G.Dj = createjs.promote(Dj, "GameComponent");

})();