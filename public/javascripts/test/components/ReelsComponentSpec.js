/*! kingkong 0.0.1 - 2015-02-03
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("ReelsComponent Test", function () {

	beforeEach(function () {

		this.class = new G.ReelsComponent();

		sinon.stub(this.class, "initDomEvents");
		spyOn(this.class, "shuffleReels");
	});

	afterEach(function() {

		this.class.initDomEvents.restore();

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.ReelsComponent));
	});

	it("Class vars are initialised correctly", function() {

		expect(this.class.symbolSprites).toBeNull();
		expect(this.class.setup).toBeNull();
		expect(this.class.reelsData).toEqual(jasmine.any(Array));
		expect(this.class.reels).toEqual(jasmine.any(Array));
		expect(this.class.reelMap).toBeNull();
		expect(this.class.reelsSpinning).toBe(0);

	});

	it("init function should set a Setup object from passed arg", function() {
		var setup = {
			reelAnimation: {

			},
			reelMap: "reelMap"
		};
		this.class.init(setup);
		expect(this.class.setup).toBe(setup);
		expect(this.class.reelsMap).toBe("reelMap");
	});

	it("init function should set the symbolSprites object from passed arg", function() {
		var symbolSprites = "symbols";
		var setup = {
			reelAnimation: {

			}
		};
		this.class.init(setup, null, symbolSprites);
		expect(this.class.symbolSprites).toBe("symbols");
	});

	it("If setup.reelAnimation.shuffleReels is truthy then shuffle reelsData", function() {
		var setup = {
			reelAnimation: {
				shuffleReels: 1
			}
		};

		this.class.init(setup);

		expect(this.class.shuffleReels).toHaveBeenCalled();
	});

	it("If setup.reelAnimation.shuffleReels is falsey then do not shuffle reelsData", function() {
		var setup = {
			reelAnimation: {
				shuffleReels: 0
			}
		};

		this.class.init(setup);

		expect(this.class.shuffleReels).not.toHaveBeenCalled();
	});



});