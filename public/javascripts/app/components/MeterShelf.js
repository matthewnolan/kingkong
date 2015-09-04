/*! kingkong 0.3.4 - 2015-04-09
 * Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
    "use strict";

    /**
     *
     * @class MeterShelf
     * @extends createjs.Container
     * @constructor
     */
    var MeterShelf = function () {
        this.Container_constructor();
    };

    var p = createjs.extend(MeterShelf, createjs.Container);
    p.constructor = MeterShelf;

    /**
     * A constant - the states the MeterShelf can be in
     * @type {{CLOSED: number, OPENING: number, OPEN: number, CLOSING: number}}
     */
    MeterShelf.states = {
        CLOSED: 0,
        OPENING: 1,
        OPEN: 2,
        CLOSING: 3
    };

    /**
     * Current state of the shelf - a number corresponding to this.states
     * @type {number}
     */
    p.state = null;

    p.slideOpenX = null;

    p.slideClosedX = null;

    p.init = function(signalDispatcher) {
        this.signalDispatcher = signalDispatcher;
        this.state = MeterShelf.states.CLOSED;

        this.slideClosedX = 100;
        this.slideOpenX = 0;
    };

    p.drawContent = function(background, content) {
        this.visible = false;

        this.alpha = 0;

        this.background = background;
        this.background.x = this.slideClosedX;
        this.addChild(this.background);

        this.content = content;

        this.contentGroup = new createjs.Container();
        this.contentGroup.alpha = 0;
        this.contentGroup.addChild.apply(this.contentGroup, this.content);

        this.addChild(this.contentGroup);
    };

    p.toggle = function() {
        switch(this.state) {
            case MeterShelf.states.OPEN:
                this.close();
                break;
            case MeterShelf.states.CLOSED:
                this.open();
                break;
        }
    };

    p.open = function() {
        this.transitionOpenStart();
    };

    p.close = function() {
        this.transitionCloseStart();
    };

    p.transitionOpenStart = function() {
        this.signalDispatcher.meterShelfOpened.dispatch();
        this.state = MeterShelf.states.OPENING;
        this.visible = true;

        createjs.Tween.get(this.background).to({x:this.slideOpenX}, 150);
        createjs.Tween.get(this).to({alpha: 1}, 50);
        createjs.Tween.get(this.contentGroup).wait(250).to({alpha: 1}, 150)
            .call(this.transitionOpenEnd.bind(this));
    };

    p.transitionOpenEnd = function() {
        this.alpha = 1;
        this.background.x = this.slideOpenX;
        this.contentGroup.alpha = 1;
        this.state = MeterShelf.states.OPEN;
    };

    p.transitionCloseStart = function() {
        this.state = MeterShelf.states.CLOSING;

        createjs.Tween.get(this.background).to({x:this.slideClosedX}, 100);
        createjs.Tween.get(this.contentGroup).to({alpha: 0}, 50);
        createjs.Tween.get(this).to({alpha: 0}, 150)
            .call(this.transitionCloseEnd);
    };

    p.transitionCloseEnd = function() {
        this.state = MeterShelf.states.CLOSED;
        this.visible = false;
        this.alpha = 0;
        this.contentGroup.alpha = 0;
        this.background.x = this.slideClosedX;
        this.signalDispatcher.meterShelfClosed.dispatch();
    };

    G.MeterShelf = createjs.promote(MeterShelf, "Container");
})();