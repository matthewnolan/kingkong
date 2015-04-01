/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * A GaffeMenu component which you can call show/hide from to show and hide the menu
	 * should also draw some buttons based on setup.json's gaffes
	 *
	 * @class GaffeMenuComponent
	 * @param version {String}
	 * @constructor
	 */
	var GaffeMenuComponent = function(version) {
		this.version = version;
		this.GameComponent_constructor();
	};
	var p = createjs.extend(GaffeMenuComponent, G.GameComponent);
	p.constructor = GaffeMenuComponent;

	/**
	 * Store the buttons on the menu for deselection purposes
	 *
	 * @property buttons
	 * @type {G.GaffeButton[]}
	 */
	p.gaffeButtons = [];

	/**
	 * A version number which can be shown on the menu.
	 * nb. do a grunt build:prod to generate the index.html and inject the version number from package.json.
	 *
	 * @property version
	 * @type {string}
	 */
	p.version = "";

	/**
	 * The gaffeing buttons get added to this container, which scrolls.
	 *
	 * @property hScrollContainer;
	 * @type {createjs.Container}
	 * @default null
	 */
	p.hScrollContainer = null;

	/**
	 *
	 *
	 * @property hScrollOffset
	 * @type {null}
	 */
	p.hScrollOffset = null;

	/**
	 *
	 *
	 * @property
	 * @type {number}
	 */
	p.currentCurrency = 0;

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

		this.hScrollContainer = new createjs.Container();
		this.addChild(this.hScrollContainer);

		var i, len = this.setup.gaffeMenu.length, button, data;
		// console.log(this.setup);
		for (i = 0; i < len; i++) {
			data = this.setup.gaffeMenu[i];
			// console.log('data', data);
			button = new G.GaffeButton();
			button.init(data.type, 100, 100, 10);
			button.drawButton();
			button.x = 20 + i * button.width + i * 10;
			button.y = 40;
			button.on("click", this.buttonClicked, this);
			//button.clicked.addOnce(this.buttonClicked, this);
			this.hScrollContainer.addChild(button);
			this.gaffeButtons.push(button);
		}

		var sceneMask = new createjs.Shape();
		sceneMask.graphics.setStrokeStyle(0)
			.drawRect(0, 0, w, h)
			.closePath();
		this.addChild(sceneMask);

		this.hScrollContainer.mask = sceneMask;

		// using "on" binds the listener to the scope of the currentTarget by default
		// in this case that means it executes in the scope of the button.
		this.on("mousedown", function (evt) {
			//this.parent.addChild(this);
			self.hScrollOffset = {x: self.hScrollContainer.x - evt.stageX};
			///console.log('mousedown ::', self.hScrollOffset);
		});

		// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
		this.on("pressmove", function (evt) {
			//this.x = evt.stageX + this.offset.x;
			//this.y = evt.stageY + this.offset.y;
			// indicate that the stage should be updated on the next tick:
			//update = true;
			var scrollVal = evt.stageX + self.hScrollOffset.x;
			self.hScrollContainer.x = scrollVal < 0? scrollVal : 0;
			//console.log('pressmove ::', self.hScrollOffset);
		});

		var fpsSwitch = new G.GaffeButton();
		fpsSwitch.init("60 FPS", 70, 60, 10);
		fpsSwitch.drawButton();
		fpsSwitch.x = w - fpsSwitch.width - 20;
		fpsSwitch.y = h - fpsSwitch.height -30;
		this.addChild(fpsSwitch);
		fpsSwitch.on("click", this.fpsClicked, this);
		fpsSwitch.select();

		var uaButton = new G.GaffeButton();
		uaButton.init("UA", 70, 60, 10);
		uaButton.drawButton();
		uaButton.x = fpsSwitch.x - uaButton.width - 20;
		uaButton.y = fpsSwitch.y;
		this.addChild(uaButton);
		uaButton.on("click", function() {
			alert(window.navigator.userAgent + "\nScale:" + G.Utils.currentScale);
		}, this);

		//fpsSwitch.clicked.addOnce(this.fpsClicked, this);
		var testButton = new G.GaffeButton();
		testButton.init("Test", 70, 60, 10);
		testButton.drawButton();
		testButton.x = uaButton.x - testButton.width - 20;
		testButton.y = uaButton.y;
		this.addChild(testButton);
		testButton.on("click", function() {
			window.open("/test","_blank");
		});

		var docsButton = new G.GaffeButton();
		docsButton.init("Docs", 70, 60, 10);
		docsButton.drawButton();
		docsButton.x = testButton.x - docsButton.width - 20;
		docsButton.y = testButton.y;
		this.addChild(docsButton);
		docsButton.on("click", function() {
			window.open("/doc", "_blank");
		});

		var currencyButton = new G.GaffeButton();
		currencyButton.init("Currency", 70, 60, 10);
		currencyButton.drawButton();
		currencyButton.x = docsButton.x - currencyButton.width - 20;
		currencyButton.y = testButton.y;
		this.addChild(currencyButton);
		currencyButton.on("click", this.changeWinText, this);


		var labelTxt = new createjs.Text("Gaffe Menu", "17px Helvetica", createjs.Graphics.getRGB(255,255,126,1));
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
	 pointers: Array[1],
	 changedPointers: Array[1],
	 pointerType: "touch",
	 srcEvent: TouchEvent,
	 isFirst: false…}
	 angle: 74.98163936884933
	 center: Object
	 	x: 523
	 	y: 369
	 __proto__: Object
	 changedPointers: Array[1]
	 0: Touchlength: 1
	 __proto__: Array[0]
	 deltaTime: 2838
	 deltaX: 44
	 deltaY: 164
	 direction: 16
	 distance: 169.799882214329
	 eventType: 4isFinal: true
	 isFirst: false
	 offset
	 Direction: 8
	 pointerType: "touch"
	 pointers: Array[1]
	 0: Touch
	 clientX: 523.43798828125
	 clientY: 369.1409912109375
	 force: 1
	 identifier: 0
	 pageX: 523.43798828125
	 pageY: 369.1409912109375
	 radiusX: 22.460935592651367
	 radiusY: 22.460935592651367
	 screenX: 302screenY: 386
	 target: canvas#app
	 webkitForce: 1
	 webkitRadiusX: 22.460935592651367
	 webkitRadiusY: 22.460935592651367
	 webkitRotationAngle: 0
	 __proto__: Touchlength: 1
	 __proto__: Array[0]
	 preventDefault: function () {
	 rotation: 0
	 scale: 1srcEvent: TouchEvent
	 target: canvas#app
	 timeStamp: 1425492270324
	 type: "swipe"
	 velocity: -0.7142857142857143
	 velocityX: 0
	 velocityY: -0.7142857142857143

	 * @param e
	 */
	/*
	p.hammerSwipeEvent = function(e) {
		//alert(e);
		//alert(e.deltaX);
	};*/

	/**
	 * dispatch to SignalDispatcher to update gaffe type
	 * @method buttonClicked
	 * @param e
	 */
	p.buttonClicked = function(e) {
		console.log('buttonClicked', this, e.currentTarget);
		var button = e.currentTarget;
		this.deselectGaffeButtons(button);
		this.signalDispatcher.gaffeSelect.dispatch(button.type);
		this.hide();
	};

	p.fpsClicked = function(e) {
		//console.log("fpsClicked", this, e);
		this.signalDispatcher.fpsSwitched.dispatch();
		var button = e.currentTarget;

		if (button.selected) {
			button.deselect();
			button.changeLabel("30 FPS");
		} else {
			button.changeLabel("60 FPS");
			button.select();
		}

	};

	p.showerSwitched = function(e) {
		this.signalDispatcher.fireworkLaunched.dispatch();
		var button = e.currentTarget;

		if (button.selected) {
			button.deselect();
			button.changeLabel("Off");
		} else {
			button.changeLabel("ON!");
			button.select();
			this.hide();
		}
	};

	/**
	 * @method deselectGaffeButtons
	 * @param {G.GaffeButton} [button] do not deselect this button
	 */
	p.deselectGaffeButtons = function(button) {
		var i, len = this.gaffeButtons.length, tempButton;
		for (i  = 0; i < len; i++) {
			tempButton = this.gaffeButtons[i];
			if (!button || button !== tempButton) {
				tempButton.deselect();
			} else {
				tempButton.select();
			}
		}
	};

	/**
	 * Shows the gaffe menu
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
	 * Hides the gaffe menu
	 * @method hide
	 */
	p.hide = function() {
		createjs.Tween.get(this)
			.to({alpha: 0, scaleX: 0.01, scaleY: 0.01}, 400, createjs.Ease.getElasticIn(4,2))
			.call(this.handleComplete);
	};

	p.changeWinText = function(){
		this.currentCurrency++;
		if (this.currentCurrency === this.setup.currencySymbol.length) {
			this.currentCurrency = 0;
		}
		console.log(this.currentCurrency);
		var meterComponent = G.Utils.getGameComponentByClass(G.MeterComponent);
		meterComponent.currencySymbolChange(this.setup.currencySymbol[this.currentCurrency]);
	};


	G.GaffeMenuComponent = createjs.promote(GaffeMenuComponent, "GameComponent");

})();