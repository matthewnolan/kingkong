/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * @class GaffButton
	 * @extends G.Container
	 * @uses createjs.Container
	 * @constructor
	 */
	var GaffButton = function() {
		this.Container_constructor();
	};
	var p = createjs.extend(GaffButton, createjs.Container);
	p.constructor = GaffButton;

	/**
	 * @property labelText
	 * @type {string}
	 */
	p.labelText = "button";

	p.width = 100;

	p.height = 100;

	p.cornerRadius = 10;

	p.strokeCommand = null;

	p.strokeColor = "#ff0000";

	p.fillColor = "#099999";

	p.textColor = "#000000";

	p.clickSignal = new signals.Signal();

	p.init = function() { 

	};

	p.drawButton = function() {
		var self = this;
		console.log('button draw', this.labelText);
		var shape = new createjs.Shape();
		var gp = shape.graphics;

		gp.setStrokeStyle(3);
		this.strokeCommand = gp.beginStroke(this.color).command;
		gp.beginFill(this.fillColor);
		gp.drawRoundRect(0, 0, this.width, this.height, this.cornerRadius);
		gp.endFill().endStroke();


		this.addChild(shape);

		var labelText = new createjs.Text(this.labelText, "12px Arial", this.textColor);
		this.addChild(labelText);
		labelText.x = 10;
		labelText.y = 10;

		this.on("click", function() {
			self.clickSignal.dispatch(self);
			self.select();
		});
	};


	p.select = function() {
		this.strokeCommand.style = '#00ff00';
	};

	p.deselect = function() {
		this.strokeCommand.style = this.strokeColor;
	};

	G.GaffButton = createjs.promote(GaffButton, "Container");

})();