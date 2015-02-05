/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("Main Test", function () {
	var gameObj;

	beforeEach(function () {
		this.class = new G.Main();
		// stubs lets us return fake object so tests are happy
		sinon.stub(document, "querySelector").returns({
			setAttribute: function(key, val) {
				//do nothing
			}
		});
		gameObj = sinon.stub(G, "Game").returns({
			init: function() {

			}
		});
		sinon.stub(window, "addEventListener");
	});

	afterEach(function() {
		this.class = null;
		// tear down stubs
		document.querySelector.restore();
		window.addEventListener.restore();
		G.Game.restore();
	});

	it("Main is instantiated and is correct type", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.Main));
	});

	it("Public variables are initialised correctly", function() {
		expect(this.class.stats).toBeNull();
		expect(this.class.stage).toBeNull();
		expect(this.class.game).toBeNull();
	});

	it("Main init should create a Stage and initialise it with the correct", function() {
		// spies let us test a function is called
		sinon.spy(createjs, "Stage");
		this.class.init();
		expect(createjs.Stage).toHaveBeenCalledWith("app");
	});

	it("Main init should setup the Ticker correctly", function() {
		sinon.spy(createjs.Ticker, "on");
		this.class.init();
		expect(createjs.Ticker.on).toHaveBeenCalledWith("tick", this.class.handleTick, this.class);
	});

	it("Main init should create a ServerInterface", function() {
		sinon.spy(G, "ServerInterface");
		this.class.init();
		expect(G.ServerInterface).toHaveBeenCalled();
	});

	it("ServerInterface should be initialised", function() {
		var spiedObj, constructor = G.ServerInterface;
		spyOn(G, "ServerInterface").and.callFake(function() {
			spiedObj = new constructor();
			spyOn(spiedObj, "init");
			return spiedObj;
		});
		this.class.init();
		expect(spiedObj.init).toHaveBeenCalled();
	});

	it("Main init should create a Game", function() {

		this.class.init();
		expect(G.Game).toHaveBeenCalled();
	});

	it("Game should be initialised", function() {
		this.class.init();

		console.log(gameObj);

		expect(gameObj).toBeDefined();

		expect(gameObj.init).toHaveBeenCalled();
	});

	it("Ticker Handler should render the stage", function() {
		this.class.init();
		sinon.spy(this.class.stats, "begin");
		sinon.spy(this.class.stage, "update");
		sinon.spy(this.class.stats, "end");

		this.class.handleTick();

		expect(this.class.stats.begin).toHaveBeenCalled();
		expect(this.class.stage.update).toHaveBeenCalled();
		expect(this.class.stats.end).toHaveBeenCalled();
	});














});