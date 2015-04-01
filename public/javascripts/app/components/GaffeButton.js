/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * @class GaffeButton
	 * @extends G.Container
	 * @uses createjs.Container
	 * @constructor
	 */
	var GaffeButton = function() {
		this.Container_constructor();
	};
	var p = createjs.extend(GaffeButton, createjs.Container);
	p.constructor = GaffeButton;

	/**
	 * Button label
	 *
	 * @property labelText
	 * @type {string}
	 */
	p.labelText = "button";

	/**
	 * Button width
	 *
	 * @property width
	 * @type {number}
	 * @default 100
	 */
	p.width = 100;

	/**
	 * Button height
	 *
	 * @property height
	 * @type {number}
	 * @default 100
	 */
	p.height = 100;

	/**
	 * Button corner radius
	 * @type {number}
	 * @property cornerRadius
	 * @default 10
	 */
	p.cornerRadius = 10;

	/**
	 * createjs commands allow redrawing of drawing api graphics at runtime.
	 *
	 * @strokeCommand
	 * @type {createjs.Command}
	 */
	p.strokeCommand = null;

	/**
	 * Button stroke color
	 *
	 * @property strokeColor
	 * @type {string}
	 * @default red
	 */
	p.strokeColor = "#ff0000";

	/**
	 * Button fillColor
	 *
	 * @property fillColor
	 * @type {string}
	 * @default grey
	 */
	p.fillColor = "#099999";

	/**
	 * Button text color
	 *
	 * @property textColor
	 * @type {string}
	 * @default black
	 */
	p.textColor = "#000000";

	/**
	 * Signal dispatched when this button is clicked
	 *
	 * @property clicked
	 * @type {Signal}
	 */
	p.clicked = new signals.Signal();

	/**
	 * Button is selected
	 *
	 * @property selected
	 * @type {boolean}
	 */
	p.selected = false;

	/**
	 * Button label Textfield
	 *
	 * @property labelTF
	 * @type {createjs.Text}
	 */
	p.labelTF = null;

	/**
	 * Button action type
	 *
	 * @property type
	 * @type {string}
	 * @default ""
	 */
	p.type = "";

	/**
	 * Sets up Button params
	 *
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
	};

	/**
	 * Draws the Button based on the params
	 *
	 * @method drawButton
	 */
	p.drawButton = function() {
		// console.log('button draw', this.labelText);
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
		this.labelTF.mouseEnabled = false;

		this.mouseChildren = false;


		//this.on("click", this.handleClick, this);
	};

	/**
	 * @deprecated
	 * @method handleClick
	 */
	p.handleClick = function() {
		console.log('handleClick', this.labelText);
		this.clicked.dispatch(this);
		//self.select();
	};

	/**
	 * Update the button label at runtime
	 *
	 * @method changeLabel
	 * @param str
	 */
	p.changeLabel = function(str) {
		this.labelTF.text = str;
	};

	/**
	 * Select the button at runtime - updates the stroke to green color
	 *
	 * @method select
	 */
	p.select = function() {
		this.selected = true;
		this.strokeCommand.style = '#00ff00';
	};

	/**
	 * Deselects the button at runtime - updates the stroke to original color.
	 * @method deselect
	 */
	p.deselect = function() {
		this.selected = false;
		this.strokeCommand.style = this.strokeColor;
	};

	G.GaffeButton = createjs.promote(GaffeButton, "Container");

})();