/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * A GaffMenu component which you can call show/hide from to show and hide the menu
	 * should also draw some buttons based on setup.json's gaffs
	 * @class GaffMenuComponent
	 * @param version {String}
	 * @constructor
	 */
	var GaffMenuComponent = function(version) {
		this.version = version;
		this.GameComponent_constructor();
	};
	var p = createjs.extend(GaffMenuComponent, G.GameComponent);
	p.constructor = GaffMenuComponent;

	/**
	 * Store the buttons on the menu for deselection purposes
	 * @property buttons
	 * @type {G.GaffButton[]}
	 */
	p.buttons = [];

	/**
	 * A version number which can be shown on the menu.
	 * nb. do a grunt build:prod to generate the index.html and inject the version number from package.json.
	 * @property version
	 * @type {string}
	 */
	p.version = "";

	/**
	 * @method init
	 * @param setup
	 * @param signalDispatcher
	 */
	p.init = function(setup, signalDispatcher) {
		this.GameComponent_init(setup, signalDispatcher);
	};

	/**
	 * @method drawMenu
	 */
	p.drawMenu = function(){
		var self = this;
		var w = this.setup.bezelW;
		var h = this.setup.bezelH;

		var shape, gp;
		shape = new createjs.Shape();
		gp = shape.graphics;
		gp.setStrokeStyle(4);
		gp.beginStroke(createjs.Graphics.getRGB(0, 20, 20, 0.9));
		gp.beginFill(createjs.Graphics.getRGB(50, 100, 150, 0.75));
		gp.drawRoundRect(0, 0, w ,h, 5);
		gp.endFill();
		gp.endStroke();

		this.addChild(shape);

		var closeButton = new createjs.Container();
		shape = new createjs.Shape();
		gp = shape.graphics;
		gp.setStrokeStyle(4);
		gp.beginStroke(createjs.Graphics.getRGB(50, 100, 150, 0.5));
		gp.beginFill(createjs.Graphics.getRGB(0, 20, 20, 0.9));
		gp.drawCircle(w, 0, 20);
		gp.endFill();
		gp.endStroke();

		var closeTxt = new createjs.Text("x", "20px Helvetica", createjs.Graphics.getRGB(255,255,126,1));
		closeTxt.x = w - 5;
		closeTxt.y = - 12;

		var i, len = this.setup.playModesNew.length, button, data;
		console.log(this.setup);
		for (i = 0; i < len; i++) {
			data = this.setup.playModesNew[i];
			console.log('data', data);
			button = new G.GaffButton();
			button.init(data.type, 100, 100, 10);
			button.drawButton();
			button.x = 20 + i * button.width + i * 10;
			button.y = 40;
			button.clicked.add(this.buttonClicked, this);
			this.addChild(button);
			this.buttons.push(button);
		}


		var labelTxt = new createjs.Text("Gaff Menu", "17px Helvetica", createjs.Graphics.getRGB(255,255,126,1));
		labelTxt.x = 5;
		labelTxt.y = 5;
		labelTxt.setBounds(0,0, this.setup.bezelW, this.setup.bezelH);
		var bounds = labelTxt.getBounds();
		labelTxt.filters = [new createjs.DropShadowFilter(3, 90, 0x00000,1, 4, 5, 5, 3, false, false, false)];
		labelTxt.cache(bounds.x, bounds.y, bounds.width, bounds.height);

		var versionTxt = new createjs.Text("Version:" + this.version, "12px sans-serif", createjs.Graphics.getRGB(255,255,255, 1));
		versionTxt.x = w - 10 - versionTxt.getMeasuredWidth();
		versionTxt.y = h - 10 - versionTxt.getMeasuredHeight();
		this.addChild(versionTxt);

		this.addChild(labelTxt);
		this.addChild(closeButton);
		closeButton.addChild(shape);
		closeButton.addChild(closeTxt);

		closeButton.on('click', function() {
			self.hide();
		});

		this.regX = w / 2;
		this.regY = h / 2;

		this.visible = false;
	};

	/**
	 * dispatch to SignalDispatcher to update gaff type
	 * @method buttonClicked
	 * @param button
	 */
	p.buttonClicked = function(button) {
		this.deselectGaffButtons(button);
		this.signalDispatcher.gaffSelect.dispatch(button.type);
		this.hide();
	};

	/**
	 * @method deselectGaffButtons
	 * @param {G.GaffButton} [button] do not deselect this button
	 */
	p.deselectGaffButtons = function(button) {
		var i, len = this.buttons.length, tempButton;
		for (i  = 0; i < len; i++) {
			tempButton = this.buttons[i];
			if (!button || button !== tempButton) {
				tempButton.deselect();
			}
		}
	};

	/**
	 * Shows the gaff menu
	 * @method show
	 */
	p.show = function() {
		this.visible = true;
		this.alpha = 0;
		this.scaleX = 0.01;
		this.scaleY = 0.01;

		createjs.Tween.get(this)
			.to({alpha: 1, scaleX: 1, scaleY: 1}, 400, createjs.Ease.getElasticOut(4,2));
	};

	/**
	 * visible false
	 * @method handleComplete
	 */
	p.handleComplete = function() {
		this.visible = false;
	};

	/**
	 * Hides the gaff menu
	 * @method hide
	 */
	p.hide = function() {
		this.visible = true;
		this.alpha = 1;

		createjs.Tween.get(this)
			.to({alpha: 0, scaleX: 0.01, scaleY: 0.01}, 400, createjs.Ease.getElasticIn(4,2))
			.call(this.handleComplete);
	};


	G.GaffMenuComponent = createjs.promote(GaffMenuComponent, "GameComponent");

})();