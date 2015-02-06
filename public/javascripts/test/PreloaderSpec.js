/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("Preloader Test", function () {

	beforeEach(function () {

		this.class = new G.Preloader();

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.Preloader));
	});

	it("Public vars are initialised correctly", function() {
		expect(this.class.SETUP_URL).toEqual("assets/config/setup.json");
		expect(this.class.game).toBeNull();
		expect(this.class.setupLoader).toBeNull();
		expect(this.class.assetsLoader).toBeNull();
		expect(this.class.spriteSheetBigWin).toBeNull();
		expect(this.class.spriteSheetStatics).toBeNull();
		expect(this.class.spriteSheetSymbolAnims).toBeNull();
	});

	it("Signals are initialised correctly", function() {
		expect(this.class.setupComplete).toEqual(jasmine.any(signals.Signal));
		expect(this.class.assetsLoaded).toEqual(jasmine.any(signals.Signal));
	});

	it("init function should set game based on args", function() {
		var mockGame = {
			"init": function () {
			}
		};

		this.class.init(mockGame);

		expect(this.class.game).toEqual(mockGame);
	});


	it("init function should create a new LoadQueue for setup data", function() {
		this.class.init();

		expect(this.class.setupLoader).toEqual(jasmine.any(createjs.LoadQueue));
	});

	it("init function should create a new LoadQueue for assets", function() {
		this.class.init();

		expect(this.class.assetsLoader).toEqual(jasmine.any(createjs.LoadQueue));
	});

	it("init function should create 'fileload' eventListener for setupLoader", function() {

		spyOn(this.class, "handleSetupLoaded");

		this.class.init();

		this.class.setupLoader.dispatchEvent(new Event("fileload"));

		expect(this.class.handleSetupLoaded).toHaveBeenCalled();
	});

	it("init function should create 'complete' eventListener for assetsLoader", function() {

		spyOn(this.class, "handleAssetsLoaded");

		this.class.init();

		this.class.assetsLoader.dispatchEvent(new Event("complete"));

		expect(this.class.handleAssetsLoaded).toHaveBeenCalled();

	});


	it("startLoad function should load the setup.json file", function() {

		var mockGame = {
			"init": function () {
			}
		};

		this.class.init(mockGame);

		spyOn(this.class.setupLoader, "loadFile");

		this.class.startLoad();

		expect(this.class.setupLoader.loadFile).toHaveBeenCalledWith(this.class.SETUP_URL);
	});

	it("handleSetupLoaded should dispatch a 'setupComplete' Signal and pass the result", function() {

		var event = {
			result: "mock setup data"
		};

		//stubs also let us ignore function calls we are not testing in this unit
		sinon.stub(this.class, "loadGameAssets");

		spyOnSignal(this.class.setupComplete);

		this.class.handleSetupLoaded(event);

		expect(this.class.setupComplete).toHaveBeenDispatchedWith("mock setup data");
	});

	it("handleSetupLoaded should then start loading game assets", function() {

		var event = {
			result: "mock setup data"
		};

		sinon.stub(this.class.setupComplete, "dispatch");

		spyOn(this.class, "loadGameAssets");

		this.class.handleSetupLoaded(event);

		expect(this.class.loadGameAssets).toHaveBeenCalled();

	});


	it("loadGameAssets should load the assets spriteManfiest", function() {

		var mockGame = {
			setup: {
				spritesManifest: "mock sprites manifest"
			}
		};

		this.class.init(mockGame);

		spyOn(this.class.assetsLoader, "loadManifest");

		this.class.loadGameAssets();

		expect(this.class.assetsLoader.loadManifest).toHaveBeenCalledWith("mock sprites manifest");

	});


	it("handleAssetsLoaded should dispatch an 'assetsLoaded' Signal with loaded assets", function() {

		this.class.init();

		sinon.stub(this.class.assetsLoader, "getResult").returns("fakeAsset");

		spyOnSignal(this.class.assetsLoaded);

		this.class.handleAssetsLoaded(event);

		expect(this.class.assetsLoaded).toHaveBeenDispatchedWith({
			spriteSheetBigWin: "fakeAsset",
			spriteSheetStatics: "fakeAsset",
			spriteSheetSymbolAnims: "fakeAsset"
		});

	});

});