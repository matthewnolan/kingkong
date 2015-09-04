/*! kingkong 0.3.4 - 2015-04-09
 * Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
    "use strict";

    /**
     *
     * @class ScrollSelector
     * @extends createjs.Container
     * @constructor
     */
    var ScrollSelector = function() {
        this.Container_constructor();
    };

    var p = createjs.extend(ScrollSelector, createjs.Container);
    p.constructor = ScrollSelector;

    p.itemData = null;

    /**
     *
     * @type {Array}
     */
    p.items = null;

    /**
     * Good old setup.json stored here
     *
     * @property setup
     * @type {Object}
     */
    p.setup = null;

    /**
     * Reference to signalDispatcher
     *
     * @property signalDispatcher
     * @type {G.SignalDispatcher}
     */
    p.signalDispatcher = null;

    p.visibleItems = null;

    p.highlightedItem = null;

    /**
     * Value of the selected item before any formatting
     * @type {Number}
     */
    p.value = null;

    p.init = function(itemData, formatter, setup, signalDispatcher) {
        this.setup = setup;
        this.signalDispatcher = signalDispatcher;

        this.itemData = itemData;
        this.formatter = formatter;

        this.items = [];
        this.visibleItems = [];
    };

    p.drawSelector = function() {
        var area = new createjs.Shape();
        area.graphics.beginFill('red').drawRect(-50, -20, 100, 200);
        this.hitArea = area;

        this.itemData.forEach(function(item, index) {
            this.drawSelectorItem(item, index);
        }.bind(this));

        createjs.Touch.enable(this);

        var lastY,
            deltaY;

        this.on('pressmove', function(event) {
            if(lastY) {
                deltaY = event.localY - lastY;
                this.update(deltaY);
            }
            lastY = event.localY;
        }, this, false);

        this.on('pressup', function(event) {
            if(this.highlightedItem) {

                var from = this.highlightedItem.y,
                    to = 80;

                this.update(to - from);

                this.signalDispatcher.linesPerLineChanged.dispatch();
            }
            lastY = null;
        }, this, false);
    };

    p.drawSelectorItem = function(item, index) {
        item = (this.formatter) ? this.formatter(item) : item;

        var itemTxt = new createjs.Text(item, "18px Arial", "#ffffff");
        itemTxt.textAlign = "center";
        itemTxt.textBaseline = "middle";
        itemTxt.y = index * 40;

        var bounds = itemTxt.getBounds();
        itemTxt.cache(bounds.x, bounds.y, bounds.width, bounds.height);

        this.updateItem(itemTxt, index);
        this.addChild(itemTxt);

        this.items[this.items.length] = this.visibleItems[this.visibleItems.length] = itemTxt;
    };

    p.getFormatForYPosition = function(yPosition, isHighlighted) {
        var val = (yPosition / 160) * (Math.PI);
        var sine = Math.abs(Math.sin(val));
        return {alpha: 0.1 + 0.9*sine, scale: 0.6 + 0.4*sine, color: isHighlighted ? '#f333f2' : '#ffffff'};
    };

    p.update = function(deltaY, ignoreCallback) {
        if(this.visibleItems[0] === this.items[0]) {
            if(this.visibleItems[0].y + deltaY > 80) {
                deltaY = 80 - this.visibleItems[0].y;
            }
        }
        if(this.visibleItems[this.visibleItems.length-1] === this.items[this.items.length-1]) {
            if(this.visibleItems[this.visibleItems.length-1].y + deltaY < 80) {
                deltaY = 80 - this.visibleItems[this.visibleItems.length-1].y;
            }
        }
        this.visibleItems.forEach(function(item, index) {
            item.y += deltaY;
            this.updateItem(item, index);
        }.bind(this));

        if(!ignoreCallback && typeof this.updateCallback === 'function') {
            this.updateCallback.call(this.updateCallbackContext, deltaY);
        }
    };

    p.updateItem = function(item, index) {
        var yPositionPercent = (item.y / 160);
        var isHighlighted = yPositionPercent > 0.4 && yPositionPercent < 0.6;

        if(yPositionPercent < 0.0 || yPositionPercent > 1.0) {
            item.alpha = 0;
        } else {
            if(isHighlighted) {
                this.highlightedItem = item;
                this.value = this.itemData[index];
            }
            var format = this.getFormatForYPosition(item.y, isHighlighted);
            item.alpha = format.alpha;
            item.scaleX = item.scaleY = format.scale;
            if(item.color !== format.color) {
                item.color = format.color;
                item.updateCache();
            }
        }
    };

    p.setUpdateCallback = function(callback, callbackContext) {
        this.updateCallback = callback;
        this.updateCallbackContext = callbackContext;
    };

    G.ScrollSelector = createjs.promote(ScrollSelector, "Container");
})();