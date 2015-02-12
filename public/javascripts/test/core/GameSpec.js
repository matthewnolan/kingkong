/*! kingkong 0.0.1 - 2015-02-02
 * Copyright (c) 2015 Licensed @HighFiveGames */

describe("Game Test", function () {

	beforeEach(function () {

		this.class = new G.Game();

		// this stub lets us create a fake preloader, and test that correct
		// functions are called on it without envoking the actual Preloader functions
		sinon.stub(G, "Preloader").returns({
			init: jasmine.createSpy("preloader.init"),
			setupComplete: new signals.Signal(),
			assetsLoaded: new signals.Signal(),
			startLoad: jasmine.createSpy("preloader.startLoad")
		});

		spyOn(this.class, "setupDisplay");
		spyOn(this.class, "initUIEvents");

	});

	afterEach(function () {
		this.class = null;
		G.Preloader.restore();
	});

	it("Class is instantiated", function () {
		expect(this.class).toBeDefined();
	});

	it("Class vars are initialised correctly", function () {
		expect(this.class.setup).toBeNull();
		expect(this.class.serverInterface).toBeNull();
		expect(this.class.assets).toBeNull();
	});

	it("init function should set a passed serverInterface", function () {
		var mockServerInterface = {
			mock: "server"
		};
		this.class.init(null, mockServerInterface);
		expect(this.class.serverInterface).toEqual(mockServerInterface);
	});

	it("init function should set a passed stage object", function () {
		var mockStage = {
			mock: "stage"
		};
		this.class.init(mockStage, null);
		expect(this.class.stage).toEqual(mockStage);
	});

	it("init function should create a new Preloader and initialise it", function () {

		var fakeLoader = new G.Preloader();

		this.class.init();

		expect(fakeLoader.init).toHaveBeenCalled();
	});

	it("init function should add Signal handler which is called when setup is loaded", function () {
		var mockSetup = {
			fake: "data"
		};

		var fakeLoader = new G.Preloader();
		spyOn(this.class, "onSetupLoaded");

		this.class.init();

		fakeLoader.setupComplete.dispatch(mockSetup);

		expect(this.class.onSetupLoaded).toHaveBeenCalled();
	});

	it("init function should add a Signal handler which is called when assets have finished loading", function() {

		var mockAssets = {
			fake: "assets"
		};
		var fakeLoader = new G.Preloader();
		spyOn(this.class, "onAssetsLoadComplete");

		this.class.init();

		fakeLoader.assetsLoaded.dispatch(mockAssets);

		expect(this.class.onAssetsLoadComplete).toHaveBeenCalled();
	});

	it("onSetupLoaded function should save the setup in this class", function() {

		var data = "setupJson";

		this.class.onSetupLoaded(data);

		expect(this.class.setup).toBe("setupJson");

	});


	it("onAssetsLoadComplete should save the assets in this class", function() {

		var data = "fakeAssets";

		this.class.onAssetsLoadComplete(data);

		expect(this.class.assets).toBe("fakeAssets");
	});

	it("when assets are loaded to Game, then setup the display", function() {

		this.class.onAssetsLoadComplete();

		expect(this.class.setupDisplay).toHaveBeenCalled();
	});

	it("when assets are loaded to Game, then initialse User Interface Events", function() {

		this.class.onAssetsLoadComplete();

		expect(this.class.initUIEvents).toHaveBeenCalled();

	});

	xdescribe("setupDisplay function", function() {

		beforeEach(function() {

		});

		afterEach(function() {

		});

		it("display layer for background created", function() {

		});

	});



	/*
	 p.setupDisplay = function() {
	 var bezelMarginL = this.setup.bezelMarginL;
	 var bezelMarginT = this.setup.bezelMarginT;
	 var bezelW = this.setup.bezelW;
	 var bezelH = this.setup.bezelH;

	 var bgLayer = new createjs.Container();
	 this.stage.addChild(bgLayer);

	 var spriteSheet = new createjs.SpriteSheet(this.assets.spriteSheetStatics);
	 var sprite = new createjs.Sprite(spriteSheet, 'ui-bezel');
	 bgLayer.addChild(sprite);

	 this.reelsComponent = new G.ReelsComponent();
	 this.reelsComponent.init(this.setup, spriteSheet);
	 this.reelsComponent.drawReels();
	 this.reelsComponent.x = bezelMarginL;
	 this.reelsComponent.y = bezelMarginT;
	 bgLayer.addChild(this.reelsComponent);

	 var sceneMask = new createjs.Shape();
	 sceneMask.graphics.setStrokeStyle(0)
	 .drawRect(bezelMarginL, bezelMarginT, bezelW, bezelH)
	 .closePath();
	 this.stage.addChild(sceneMask);
	 if (!this.setup.devMode) this.reelsComponent.mask = sceneMask;

	 };
	 */


});