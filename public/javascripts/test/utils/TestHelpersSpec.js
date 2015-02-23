/*! kingkong 0.0.1 - 2015-02-06
 * Copyright (c) 2015 Licensed @HighFiveGames */

describe("TestHelpers Test", function () {

	var SCALE_FACTOR = (1 / 0.9375);

	beforeEach(function (done) {
		var self = this;
		this.assetsBasePath = "_assets/art/";
		var assetsPath = "assets/sprites/symbol_anims.json";

		this.stage = new createjs.Stage(imagediff.createCanvas(116, 103));

		var img = this.img = new Image();
		img.onload = function () {
			self.assetsLoader = new createjs.LoadQueue(true);
			self.assetsLoader.on("error", function() {
				console.warn('load error: ' + assetsPath);
			});
			self.assetsLoader.on("complete", function() {
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
		img.src = this.assetsBasePath + "daisy.png";
		jasmine.addMatchers(imagediff.jasmine);

		this.compareImage = function (path, done, expect, pixelTolerance) {
			var stage = this.stage;
			stage.update();
			var img = new Image();
			img.src = path;
			img.onload = function () {
				var pixels = this.width * this.height;
				var tolerance = pixels * (typeof pixelTolerance === 'undefined' ? 0.005 : pixelTolerance);
				expect(stage.canvas).toImageDiffEqual(this, tolerance); //###### < ERROR THROWN #######
				done();
			};
			img.onerror = function () {
				fail(img.src + ' failed to load');
				done();
			};
		};
	});


	it("SymbolAnims are loaded", function () {
		expect(this.assetsLoader.getResult('symbolAnims')).toBeDefined();
	});

	it("Can draw a symbol", function(done) {
		var self = this;
		var spriteSheet = new createjs.SpriteSheet(this.assetsLoader.getResult('symbolAnims'));
		var sprite = new createjs.Sprite(spriteSheet, 0);
		sprite.scaleX = sprite.scaleY = SCALE_FACTOR;

		this.stage.addChild(sprite);
		//Give some time for the sprite to update to stage
		setTimeout(function() {
			sprite.gotoAndStop(260);
			self.compareImage("/javascripts/test/assets/m1-sprite__000.png", done, expect, 0.01);
		}, 100);




	});




});