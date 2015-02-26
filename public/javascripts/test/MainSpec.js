/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("Main Test", function () {

	beforeEach(function () {
		this.class = new G.Main();

		// stubs lets us return fake object so tests are happy
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
		//this.class.proton.restore();
		this.class = null;
		// tear down stubs
		document.body.appendChild.restore();
		document.querySelector.restore();
		//document.querySelector.restore();
		//G.Game.restore();
	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.Main));
	});

	it("Public variables are initialised correctly", function() {
		expect(this.class.stats).toBeNull();
		expect(this.class.stage).toBeNull();
		expect(this.class.game).toBeNull();
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

	it("Main init should create a Game and initialise it", function() {
		this.class.init();

		expect(G.Game).toHaveBeenCalled();

		expect(this.class.game.init).toHaveBeenCalled();
	});
















});