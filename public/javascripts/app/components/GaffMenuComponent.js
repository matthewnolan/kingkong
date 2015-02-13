/*! kingkong 0.0.6 - 2015-02-12
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var GaffMenuComponent = function(version) {
		this.version = version;
		this.GameComponent_constructor();
	};
	var p = createjs.extend(GaffMenuComponent, G.GameComponent);
	p.constructor = GaffMenuComponent;


	p.version = null;

	p.init = function(setup, signalDispatcher) {
		this.GameComponent_init(setup, signalDispatcher);

	};

	p.drawMenu = function(){
		var self = this;
		var w = this.setup.bezelW;
		var h = this.setup.bezelH;

		// console.log('Draw GaffMenu');
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

		var closeTxt = new createjs.Text("X", "19px Helvetica", createjs.Graphics.getRGB(100,100,100,0.75));
		//closeButton.addChild(txt);
		closeTxt.x = w - 6;
		closeTxt.y = - 12;


		var labelTxt = new createjs.Text("Gaff Menu", "17px Helvetica", createjs.Graphics.getRGB(255,255,126,1));
		labelTxt.x = 5;
		labelTxt.y = 5;
		labelTxt.setBounds(0,0, this.setup.bezelW, this.setup.bezelH);
		var bounds = labelTxt.getBounds();
		labelTxt.filters = [new createjs.DropShadowFilter(3, 90, 0x00000,1, 4, 5, 5, 3, false, false, false)];
		labelTxt.cache(bounds.x, bounds.y, bounds.width, bounds.height);

		var versionTxt = new createjs.Text("Version:" + this.version, "12px sans-serif", createjs.Graphics.getRGB(255,255,255, 1));
		versionTxt.x = w - versionTxt.getMeasuredWidth();
		versionTxt.y = h - versionTxt.getMeasuredHeight();
		this.addChild(versionTxt);

		this.addChild(labelTxt);
		this.addChild(closeButton);
		closeButton.addChild(shape);
		closeButton.addChild(closeTxt);

		closeButton.on('click', function() {
			console.log("mofo", self);
			self.hide();
		});

		this.regX = w / 2;
		this.regY = h / 2;

		this.visible = false;
	};

	p.show = function() {
		this.visible = true;
		this.alpha = 0;
		this.scaleX = 0.01;
		this.scaleY = 0.01;

		createjs.Tween.get(this)
			.to({alpha: 1, scaleX: 1, scaleY: 1, visible:true}, 400, createjs.Ease.getElasticOut(4,2));
	};

	p.handleComplete = function() {
		console.log('show gaff complete');
		this.visible = false;
	};

	p.hide = function() {
		this.visible = true;
		this.alpha = 1;

		createjs.Tween.get(this)
			.to({alpha: 0, scaleX: 0.01, scaleY: 0.01}, 400, createjs.Ease.getElasticIn(4,2))
			.call(this.handleComplete);
	};


	G.GaffMenuComponent = createjs.promote(GaffMenuComponent, "GameComponent");

})();