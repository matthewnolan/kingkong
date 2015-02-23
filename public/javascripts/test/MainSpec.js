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

		spyOn(createjs.Ticker, "on");

		spyOn(G, "Game").and.returnValue({
			init: jasmine.createSpy("game.init"),
			fpsSwitcher: {
				add: jasmine.createSpy('signal spy')
			}
		});
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

	});

	afterEach(function() {
		this.class = null;
		// tear down stubs
		window.Stats.restore();
		document.body.appendChild.restore();
		document.querySelector.restore();
		window.addEventListener.restore();
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

	it("Main init should setup the Ticker correctly", function() {
		this.class.init();
		expect(createjs.Ticker.on).toHaveBeenCalledWith("tick", this.class.handleTick, this.class);
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

	it("Main init should create a Game and initialise it", function() {
		this.class.init();

		expect(G.Game).toHaveBeenCalled();

		expect(this.class.game.init).toHaveBeenCalled();
	});

	it("Ticker Handler should render the stage", function() {
		this.class.init();

		spyOn(this.class.stage, "update");

		this.class.handleTick();

		expect(this.class.stats.begin).toHaveBeenCalled();
		expect(this.class.stage.update).toHaveBeenCalled();
		expect(this.class.stats.end).toHaveBeenCalled();
	});














});