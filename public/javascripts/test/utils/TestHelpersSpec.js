/*! kingkong 0.0.1 - 2015-02-06
 * Copyright (c) 2015 Licensed @HighFiveGames */

describe("TestHelpers Test", function () {

	//This needs to match the scale factor that sprite sheets are scaled to in TexturePacker.
	var SCALE_FACTOR = (1 / 0.9375);
	var timeoutInterval = 5000;
	var timeToUpdateStage = 200;
	var originalTimeout;

	beforeEach(function (done) {
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = timeoutInterval;
		var self = this;
		var assetsPath = "assets/sprites/symbol_anims.json";

		this.stage = new createjs.Stage(imagediff.createCanvas(116, 103));

		var img = this.img = new Image();
		img.onload = function () {
			self.assetsLoader = new createjs.LoadQueue(true);
			self.assetsLoader.on("error", function() {
				fail(assetsPath + ' failed to load');
				done();
			});
			self.assetsLoader.on("complete", function() {
				console.log('test assets loaded');
				done();
			});
			self.assetsLoader.loadManifest(
				[
					{"src": assetsPath, "id": "symbolAnims"}
				]
			);
		};
		img.onerror = function () {
			fail(img.src + ' failed to load');
			done();
		};
		img.src = "javascripts/test/assets/m1-sprite__000.png";
		jasmine.addMatchers(imagediff.jasmine);

		this.compareImage = function (path, done, expect, pixelTolerance) {
			var stage = this.stage;
			stage.update();
			var img = new Image();
			img.src = path;
			img.onload = function () {
				var pixels = this.width * this.height;
				var tolerance = pixels * (typeof pixelTolerance === 'undefined' ? 0.005 : pixelTolerance);
				expect(stage.canvas).toImageDiffEqual(this, tolerance); //TEST
				done();
			};
			img.onerror = function () {
				fail(img.src + ' failed to load');
				done();
			};
		};
	});

	afterEach(function() {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});

	it("SymbolAnims are loaded", function () {
		expect(this.assetsLoader.getResult('symbolAnims')).toEqual(jasmine.any(Object));
	});

	it("Can draw a symbol", function(done) {
		var self = this;
		var spriteSheet = new createjs.SpriteSheet(this.assetsLoader.getResult('symbolAnims'));
		var sprite = new createjs.Sprite(spriteSheet, 0);
		sprite.scaleX = sprite.scaleY = SCALE_FACTOR;

		this.stage.addChild(sprite);
		//Give some time for the sprite to update to stage
		setTimeout(function() {
			sprite.gotoAndStop(256);
			self.compareImage("javascripts/test/assets/m1-sprite__000.png", done, expect, 0.2);
		}, timeToUpdateStage);
	});




});