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

		sinon.stub(document.body, "appendChild");
		sinon.stub(document, "querySelector").returns({
			setAttribute: function() {
				//do nothing
			},
			style: {
				width: 100,
				height: 100
			}
		});


		spyOn(this.class, "setupDisplay");

		spyOn(this.class, "initUIEvents");

		spyOn(createjs.Ticker, "on");

		sinon.stub(window, "addEventListener");
		sinon.stub(window, "Stats").returns({
			setMode: function() {

			},
			begin: jasmine.createSpy("stats.begin"),
			end: jasmine.createSpy("stats.end"),
			domElement: {
				style: {
					position: "",
					bottom: "",
					left: ""
				}
			}
		});

		this.class.proton = {
			update: jasmine.createSpy('proton.update')
		};

	});

	afterEach(function () {
		this.class = null;
		G.Preloader.restore();
		window.Stats.restore();
		document.body.appendChild.restore();
		document.querySelector.restore();
		window.addEventListener.restore();
	});

	it("Class is instantiated", function () {
		expect(this.class).toBeDefined();
	});

	it("Class vars are initialised correctly", function () {
		expect(this.class.setup).toBeNull();
		expect(this.class.serverInterface).toBeNull();
		expect(this.class.assets).toBeNull();
	});

	it("Check version injection string is set correctly", function() {
		console.warn("this test will fail if tested against the minified source code");
		expect(this.class.version).toEqual("{{ VERSION }}");
	});

	it("Main init should create a ServerInterface", function() {
		spyOn(G, "ServerInterface").and.returnValue({
			init: function() {
				//do nothing
			}

		});
		this.class.init();
		expect(G.ServerInterface).toHaveBeenCalled();
	});

	it("ServerInterface should be initialised", function() {
		var spiedObj, Constructor = G.ServerInterface;
		spyOn(G, "ServerInterface").and.callFake(function() {
			spiedObj = new Constructor();
			spyOn(spiedObj, "init");
			return spiedObj;
		});
		this.class.init();
		expect(spiedObj.init).toHaveBeenCalled();
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

	it("Main init should create a Stage and initialise it with the correct values", function() {
		// spies let us test a function is called
		spyOn(createjs, "Stage").and.returnValue({
			addChild: function() {

			}
		});
		this.class.init();
		expect(createjs.Stage).toHaveBeenCalledWith("app");
	});

	it("onSetupLoaded function should save the setup in this class", function() {

		var data = "setupJson";

		spyOn(this.class, 'rescale');

		this.class.onSetupLoaded(data);

		expect(this.class.setup).toBe("setupJson");

	});


	it("onAssetsLoadComplete should save the assets in this class", function() {

		var data = "fakeAssets";

		/*
		 this.setupDisplay();
		 this.initUIEvents();
		 this.displayInitialised();
		 */

		spyOn(this.class, "displayInitialised");

		this.class.onAssetsLoadComplete(data);

		expect(this.class.assets).toBe("fakeAssets");
	});

	it("when assets are loaded to Game, then setup the display", function() {

		spyOn(this.class, "displayInitialised");

		this.class.onAssetsLoadComplete();

		expect(this.class.setupDisplay).toHaveBeenCalled();
	});

	it("when assets are loaded to Game, then initialse User Interface Events", function() {
		spyOn(this.class, "displayInitialised");

		this.class.onAssetsLoadComplete();

		expect(this.class.initUIEvents).toHaveBeenCalled();

	});

	it("Main displayInitialised should setup the Ticker correctly", function() {
		spyOn(this.class, "createProton");
		spyOn(this.class, "launchFirework");
		//spyOn(this.class, "createFireWorks");
		//this.class.displayInitialised.restore();

		this.class.displayInitialised();
		expect(createjs.Ticker.on).toHaveBeenCalledWith("tick", this.class.handleTick, this.class);
	});


	it("Ticker Handler should render the stage", function() {
		this.class.init();

		spyOn(this.class.stage, "update");

		this.class.handleTick();

		expect(this.class.stats.begin).toHaveBeenCalled();
		expect(this.class.proton.update).toHaveBeenCalled();
		expect(this.class.stage.update).toHaveBeenCalled();
		expect(this.class.stats.end).toHaveBeenCalled();
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