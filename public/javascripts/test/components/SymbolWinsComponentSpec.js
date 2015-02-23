/*! kingkong 0.0.6 - 2015-02-11
* Copyright (c) 2015 Licensed @HighFiveGames */

xdescribe("SymbolWinsComponent Test", function () {
	var self = this;

	jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;

	var compareImage = function (path, done, expect, pixelTolerance) {
		var stage = self.stage;
		stage.update();
		var img = new Image();
		img.src = path;
		img.onload = function () {
			var pixels = this.width * this.height;
			var tolerance = pixels * (typeof pixelTolerance === 'undefined' ? 0.005 : pixelTolerance);

			console.log('image loaded', this, stage.canvas, imagediff);

			expect(stage.canvas).toImageDiffEqual(this, tolerance); //###### < ERROR THROWN #######
			done();
		};
		img.onerror = function () {
			fail(img.src + ' failed to load');
			done();
		};
	};

	beforeEach(function (done) {
		this.assetsBasePath = "_assets/art/";

		this.sColor = "#000";
		this.fColor = "#ffffff";

		self.stage = new createjs.Stage(imagediff.createCanvas(116, 103));

		var img = this.img = new Image();

		img.onload = function () {
			done();
		};

		img.onerror = function () {
			fail(img.src + ' failed to load');
			done();
		};

		img.src = this.assetsBasePath + "daisy.png";

		this.class = new G.SymbolWinsComponent();

		jasmine.addMatchers(imagediff.jasmine);

		var shape = new createjs.Shape();
		this.g = shape.graphics;
		self.stage.addChild(shape);
	});

	it("Correct M1 animation frame 000 is shown", function(done) {
		//var stage = new createjs.Stage(imagediff.createCanvas(116, 103));
		this.g.setStrokeStyle(2);
		this.g.beginStroke(this.sColor);
		this.g.beginFill(this.fColor);
		this.g.drawRect(0,0,116, 113);


		compareImage("/javascripts/test/assets/m1-sprite__000.png", done, expect, 0.01);

	});


	xit("Class can be instantiated", function () {
		//expect(this.class).toBeDefined();
		//expect(this.class).toEqual(jasmine.any(G.SymbolWinsComponent));
	});

	xit("Class vars are initialised correctly", function () {
		expect(this.class.classVar).toBeDefined();
	});




});