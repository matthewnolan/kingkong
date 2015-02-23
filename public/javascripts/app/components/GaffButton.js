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

	p.clicked = new signals.Signal();

	p.selected = false;

	/**
	 * property labelTF
	 * @type {createjs.Text}
	 */
	p.labelTF = null;

	/**
	 *
	 * @type {string}
	 */
	p.type = "";

	/**
	 * Sets up button params
	 * @method init
	 * @param labelText
	 * @param width
	 * @param height
	 * @param radius
	 * @param strokeColor
	 * @param fillColor
	 * @param textColor
	 */
	p.init = function(labelText, width, height, radius,strokeColor, fillColor, textColor) {
		this.type = this.labelText = labelText || this.labelTxt;
		this.width = width || this.width;
		this.height = height || this.height;
		this.radius = radius || this.radius;
		this.strokeColor = strokeColor || this.strokeColor;
		this.fillColor = fillColor || this.fillColor;
		this.textColor = textColor || this.textColor;

		//this.removeAllEventListeners();

		console.log('clicked Signal:', this.clicked);
		//this.clicked.addOnce();
	};

	p.drawButton = function() {
		var self = this;
		console.log('button draw', this.labelText);
		var shape = new createjs.Shape();
		var gp = shape.graphics;

		gp.setStrokeStyle(3);
		this.strokeCommand = gp.beginStroke(this.strokeColor).command;
		gp.beginFill(this.fillColor);
		gp.drawRoundRect(0, 0, this.width, this.height, this.cornerRadius);
		gp.endFill().endStroke();


		this.addChild(shape);

		this.labelTF = new createjs.Text(this.labelText, "12px Arial", this.textColor);
		this.addChild(this.labelTF);
		this.labelTF.x = 8;
		this.labelTF.y = 3;

		//this.on("click", this.handleClick, this);
	};

	p.handleClick = function() {
		console.log('handleClick', this.labelText);
		this.clicked.dispatch(this);
		//self.select();
	};

	p.changeLabel = function(str) {
		this.labelTF.text = str;
	};


	p.select = function() {
		this.selected = true;
		this.strokeCommand.style = '#00ff00';
	};

	p.deselect = function() {
		this.selected = false;
		this.strokeCommand.style = this.strokeColor;
	};

	G.GaffButton = createjs.promote(GaffButton, "Container");

})();