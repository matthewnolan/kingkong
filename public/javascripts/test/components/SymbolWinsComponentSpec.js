/*! kingkong 0.0.6 - 2015-02-11
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("SymbolWinsComponent Test", function () {
	var self = this;
	var setup;
	var signalDispatcher;
	var symbolAnims;



	beforeEach(function () {
		this.class = new G.SymbolWinsComponent();

		setup = {
			mock: "data",
			numberOfReels: 5,
			symbolsPerReel: 3,
			symbolW: 110,
			symbolH: 110,
			reelMarginRight: 10,
			symbolMarginBottom: 10,
			failSafeInitialisation: 0
		};

		signalDispatcher = sinon.createStubInstance(G.SignalDispatcher);

		symbolAnims = sinon.createStubInstance(createjs.SpriteSheet);

	});


	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.SymbolWinsComponent));
	});

	it("Class vars are set correctly", function () {
		expect(this.class.SCALE_FACTOR).toEqual(1/0.83333);
		expect(this.class.symbolAnims).toBeNull();
		expect(this.class.symbolsMatrix).toEqual([]);
		expect(this.class.currentlyPlayingSprites).toEqual([]);
		expect(this.class.initialisedSpritesNum).toEqual(0);
		expect(this.class.animationLabelSuffix).toBe("intro__001");
	});

	describe("Class can be initialised correctly", function() {

		beforeEach(function() {


		});

		it("init function should call its super", function() {
			spyOn(this.class, "GameComponent_init");

			this.class.init(setup, signalDispatcher, symbolAnims);

			expect(this.class.GameComponent_init).toHaveBeenCalledWith(setup, signalDispatcher);
		});

		it("init function should set the symbolAnims spritesheet", function() {
			this.class.init(setup, signalDispatcher, symbolAnims);

			expect(this.class.symbolAnims).toEqual(symbolAnims);
		});

		it("init function should set the setup data", function() {
			this.class.init(setup, signalDispatcher, symbolAnims);

			expect(this.class.setup).not.toBeNull();
			expect(this.class.setup.mock).toBe("data");
		});

		describe("drawSprites should create a spritesheet enabled sprite on each position based on setup.json", function() {

			beforeEach(function(){

				this.class.init(setup, signalDispatcher, symbolAnims);

			});

			it("Given a 5 x 3 symbol setup, symbolsMatrix should contain a 5 x 3 array", function() {

				this.class.drawSprites();

				expect(this.class.symbolsMatrix.length).toBe(5);
				expect(this.class.symbolsMatrix[0].length).toBe(3);
				expect(this.class.symbolsMatrix[1].length).toBe(3);
				expect(this.class.symbolsMatrix[2].length).toBe(3);
				expect(this.class.symbolsMatrix[3].length).toBe(3);
				expect(this.class.symbolsMatrix[4].length).toBe(3);


			});


		});

	});








});