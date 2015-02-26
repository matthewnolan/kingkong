/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("Main Test", function () {

	beforeEach(function () {
		this.class = new G.Main();

		spyOn(G, "Game").and.returnValue({
			init: jasmine.createSpy("game.init"),
			signalDispatcher: {
				fpsSwitched: {
					add: jasmine.createSpy('signal spy')
				},
				daisyShowerStarted: {
					add: jasmine.createSpy('signal spy')
				}
			},
			displayInitialised: {
				add: jasmine.createSpy('signal spy')
			}
		});
	});

	afterEach(function() {
		this.class = null;
	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.Main));
	});

	it("Public variables are initialised correctly", function() {
		expect(this.class.game).toBeNull();
	});

	it("Main init should create a Game and initialise it", function() {
		this.class.init();

		expect(G.Game).toHaveBeenCalled();

		expect(this.class.game.init).toHaveBeenCalled();
	});
















});