/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

xdescribe("Preloader Test", function () {

	beforeEach(function () {

		this.class = new G.Preloader();

	});

	it("Preloader is instantiated and is correct type", function () {
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


	it("start load function should load the setup.json file", function() {

		var mockGame = {
			"init": function () {
			}
		};

		this.class.init(mockGame);

		spyOn(this.class.setupLoader, "loadFile");

		this.class.startLoad();

		expect(this.class.setupLoader.loadFile).toHaveBeenCalledWith(this.class.SETUP_URL);


	});



	/**

	 p.startLoad = function() {
		console.log('{Preload} startLoad');

		this.setupLoader.loadFile(this.SETUP_URL);
	};

	 p.handleSetupLoaded = function(event) {
		console.log('handle setup loaded', this, event.result);

		this.setupComplete.dispatch(event.result);
		this.loadGameAssets();
	};

	 p.loadGameAssets = function() {
		//console.log('loadGameAssets', this.game.setup.spritesManifest);
		this.assetsLoader.loadManifest(this.game.setup.spritesManifest);
	};

	 p.handleAssetsError = function(e) { };

	 p.handleAssetsProgress = function(e) { };

	 p.handleAssetsLoaded = function(e) {
		var assets = {
			spriteSheetBigWin: this.assetsLoader.getResult('bigWinAnim'),
			spriteSheetStatics: this.assetsLoader.getResult('staticImages'),
			spriteSheetSymbolAnims: this.assetsLoader.getResult('symbolAnims')
		};

		this.assetsLoaded.dispatch(assets);
	};

	 */












});