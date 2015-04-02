/*! kingkong 0.0.1 - 2015-02-03
 * Copyright (c) 2015 Licensed @HighFiveGames */

describe("ReelsComponent Test", function () {

	var setup, signalDispatcher, serverInterface, symbolSprites, slotInitResponse;

	beforeEach(function () {
		this.class = new G.ReelsComponent();
		G.Utils.shuffle = jasmine.createSpy("Utils.shuffle");
		symbolSprites = sinon.createStubInstance(createjs.SpriteSheet);
		signalDispatcher = sinon.createStubInstance(G.SignalDispatcher);
		serverInterface = sinon.createStubInstance(G.ServerInterface);
	});

	afterEach(function () {

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.ReelsComponent));
	});

	it("Class vars are initialised correctly", function () {

		expect(this.class.symbolSprites).toBeNull();
		expect(this.class.setup).toBeNull();
		expect(this.class.reelsData).toBeNull();
		expect(this.class.reels).toEqual(jasmine.any(Array));
		expect(this.class.reelMap).toBeNull();
		expect(this.class.reelsSpinning).toBe(0);
	});

	describe("Initialisation tests", function() {
		describe("init behaves as expected", function() {
			beforeEach(function() {
				spyOn(this.class, "getInitialStrips");

				setup = {
					reelAnimation: {}
				};

				slotInitResponse = {
					reelStrips: "fakeStrips"
				};
			});

			it("init function should set a Setup object passed as 1st arg", function () {
				this.class.init(setup, signalDispatcher, serverInterface, symbolSprites, slotInitResponse);
				expect(this.class.setup).toEqual(setup);
			});

			it("init function should set the signalDispatcher passed as 2nd arg", function() {
				this.class.init(setup, signalDispatcher, serverInterface, symbolSprites, slotInitResponse);
				expect(this.class.signalDispatcher).toEqual(signalDispatcher);
			});

			it("init function should set the serverInterface passed as 3rd arg", function() {
				this.class.init(setup, signalDispatcher, serverInterface, symbolSprites, slotInitResponse);
				expect(this.class.serverInterface).toEqual(serverInterface);
			});

			it("init function should set the symbolSprites spritesheet passed as 4th arg", function () {
				this.class.init(setup, signalDispatcher, serverInterface, symbolSprites, slotInitResponse);
				expect(this.class.symbolSprites).toEqual(symbolSprites);
			});

			it("init function should set the slotInitResponse object passed as 5th arg", function () {
				this.class.init(setup, signalDispatcher, serverInterface, symbolSprites, slotInitResponse);
				expect(this.class.slotInitResponse).toEqual(slotInitResponse);
			});

			it("init function should wire the gaffeSpinRequested signal to handleGaffeSpinRequest", function() {
				spyOn(this.class, "handleGaffeSpinRequest");
				this.class.init(setup, signalDispatcher, serverInterface, symbolSprites, slotInitResponse);

				this.class.signalDispatcher.gaffeSpinRequested.dispatch("testUrl");

				expect(this.class.handleGaffeSpinRequest).toHaveBeenCalledWith("testUrl");
			});

			it("init function should get the initial reel strips data and set this.reelsData", function() {
				this.class.init(setup, signalDispatcher, serverInterface, symbolSprites, slotInitResponse);

				expect(this.class.getInitialStrips).toHaveBeenCalledWith("fakeStrips");
			});
		});

		describe("getInitialStrips returns the correct 2d array containing a cut of reelStrips", function() {

			beforeEach(function() {

				setup = {
					reelAnimation: {}
				};

				slotInitResponse = {
					reelStrips: "fakeStrips"
				};

			});

			it("this.class is defined", function() {
				expect(this.class).toBeDefined();
			});

		});

	});

	describe("serverSpinStart tests: given different spin stops, ensure Reels modification is done correctly", function() {
		var reelStrips;

		beforeEach(function() {
			setup = {
				"reelAnimation" : {
					"duration" : 2000,
					"shuffleReels" : false,
					"symbols" : {
						"cutLength" : 17,
						"stopVal" : 8,
						"replacement" : {
							"index": 17,
							"frameLabel" : "r1",
							"defaultLabel" : "m1"
						}
					},
					"delay" : {
						"max": 2000,
						"sequenced": true,
						"random" : false
					}
				}
			};

			reelStrips = [
				[10, 3, 6, 4, 9, 8, 3, 10, 8, 5, 9, 10, 0, 9, 6, 4, 8, 6, 8, 4, 8, 3, 9, 6, 4, 10, 5, 7, 9, 6, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 10, 8, 9, 2, 6, 10, 5, 10, 3, 6, 4, 9, 8, 3, 10, 0, 10, 9, 5, 8, 1, 9, 6, 4, 8, 6, 8, 4, 8, 3, 9, 6, 5, 10, 9, 6, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 10, 8, 9, 2, 6, 10, 5],
				[6, 9, 2, 7, 4, 6, 10, 9, 7, 4, 6, 9, 5, 10, 9, 10, 7, 1, 6, 10, 7, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 9, 0, 8, 1, 10, 2, 7, 6, 2, 7, 4, 10, 1, 7, 6, 9, 2, 7, 4, 10, 6, 4, 9, 7, 6, 9, 4, 7, 9, 10, 1, 4, 9, 6, 7, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 6, 0, 10, 3, 1, 10, 2, 9, 6, 2, 7, 4, 10, 1, 7],
				[2, 10, 8, 10, 5, 7, 6, 9, 1, 8, 4, 7, 2, 8, 3, 10, 0, 5, 10, 9, 7, 3, 10, 8, 7, 9, 3, 10, 2, 9, 7, 8, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 7, 10, 9, 12, 12, 12, 12, 12, 12, 12, 10, 9, 8, 9, 7, 8, 3, 2, 0, 10, 3, 2, 7, 9, 5, 8, 7, 2, 8, 10, 3, 10, 9, 5, 7, 10, 2, 8, 7, 9, 3, 10, 7, 5, 7, 9, 8, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 10, 7, 9, 12, 12, 12, 12, 12, 12, 12, 10, 9, 8, 5, 9, 7, 8, 3],
				[3, 8, 3, 1, 8, 5, 3, 4, 9, 4, 3, 7, 4, 3, 5, 3, 8, 9, 10, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 10, 9, 10, 0, 4, 1, 4, 3, 8, 3, 9, 4, 1, 8, 5, 10, 4, 3, 2, 5, 3, 4, 6, 3, 9, 3, 10, 8, 10, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 8, 9, 10, 4, 1, 9, 4, 8],
				[4, 8, 1, 3, 6, 2, 7, 4, 9, 5, 4, 2, 7, 10, 6, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 6, 7, 10, 2, 4, 9, 2, 8, 1, 4, 9, 7, 5, 2, 4, 8, 1, 6, 2, 7, 4, 9, 5, 4, 2, 7, 10, 6, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 6, 7, 0, 10, 2, 4, 9, 2, 8, 1, 4, 9, 5, 7, 2]
			];

			slotInitResponse = {reelStrips: reelStrips};

			this.class.init(setup, signalDispatcher, serverInterface, symbolSprites, slotInitResponse);

		});


		it("Given a slotInitResponse and stops are: [93, 17, 100, 116, 65] serverSpinStart should queue up reel modifications correctly", function() {
			spyOn(this.class, "spinReels");

			var Reel = function() {
				return {
					modifyReelData: jasmine.createSpy("modify reel data spy")
				};
			};

			var reel1 = new Reel();
			var reel2 = new Reel();
			var reel3 = new Reel();
			var reel4 = new Reel();
			var reel5 = new Reel();

			this.class.reels = [reel1, reel2, reel3, reel4, reel5];

			var spinResponseVO = {
				spinRecords: [{
					stops: [93, 17, 100, 116, 65]
				}]
			};

			this.class.serverSpinStart(spinResponseVO);

			expect(reel1.modifyReelData).toHaveBeenCalledWith([ 8, 1, 9, 6, 4, 8, 6, 8, 4, 8, 3, 9, 6, 5, 10, 9, 6 ]);
			expect(reel2.modifyReelData).toHaveBeenCalledWith([ 4, 6, 9, 5, 10, 9, 10, 7, 1, 6, 10, 7, 12, 12, 12, 12, 12 ]);
			expect(reel3.modifyReelData).toHaveBeenCalledWith([ 5, 7, 10, 2, 8, 7, 9, 3, 10, 7, 5, 7, 9, 8, 12, 12, 12 ]);
			expect(reel4.modifyReelData).toHaveBeenCalledWith([ 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 ]);
			expect(reel5.modifyReelData).toHaveBeenCalledWith([ 6, 7, 10, 2, 4, 9, 2, 8, 1, 4, 9, 7, 5, 2, 4, 8, 1 ]);
		});

		it("Given a slotInitResponse and stops are: [1, 1, 1, 1, 1] serverSpinStart should queue up reel modifications correctly", function() {
			spyOn(this.class, "spinReels");

			var Reel = function() {
				return {
					modifyReelData: jasmine.createSpy("modify reel data spy")
				};
			};

			var reel1 = new Reel();
			var reel2 = new Reel();
			var reel3 = new Reel();
			var reel4 = new Reel();
			var reel5 = new Reel();

			this.class.reels = [reel1, reel2, reel3, reel4, reel5];

			var spinResponseVO = {
				spinRecords: [{
					stops: [1, 1, 1, 1, 1]
				}]
			};

			this.class.serverSpinStart(spinResponseVO);

			expect(reel1.modifyReelData).toHaveBeenCalledWith([ 10, 8, 9, 2, 6, 10, 5, 10, 3, 6, 4, 9, 8, 3, 10, 8, 5 ]);
			expect(reel2.modifyReelData).toHaveBeenCalledWith([ 6, 2, 7, 4, 10, 1, 7, 6, 9, 2, 7, 4, 6, 10, 9, 7, 4 ]);
			expect(reel3.modifyReelData).toHaveBeenCalledWith([ 9, 8, 5, 9, 7, 8, 3, 2, 10, 8, 10, 5, 7, 6, 9, 1, 8 ]);
			expect(reel4.modifyReelData).toHaveBeenCalledWith([ 9, 10, 4, 1, 9, 4, 8, 3, 8, 3, 1, 8, 5, 3, 4, 9, 4 ]);
			expect(reel5.modifyReelData).toHaveBeenCalledWith([ 8, 1, 4, 9, 5, 7, 2, 4, 8, 1, 3, 6, 2, 7, 4, 9, 5 ]);
		});

		it("Given a slotInitResponse and stops are: [144, 142, 149, 139, 141] serverSpinStart should queue up reel modifications correctly", function() {
			spyOn(this.class, "spinReels");

			var Reel = function() {
				return {
					modifyReelData: jasmine.createSpy("modify reel data spy")
				};
			};

			var reel1 = new Reel();
			var reel2 = new Reel();
			var reel3 = new Reel();
			var reel4 = new Reel();
			var reel5 = new Reel();

			this.class.reels = [reel1, reel2, reel3, reel4, reel5];

			var spinResponseVO = {
				spinRecords: [{
					stops: [144, 142, 149, 139, 141]
				}]
			};

			this.class.serverSpinStart(spinResponseVO);

			expect(reel1.modifyReelData).toHaveBeenCalledWith( [ 12, 12, 10, 8, 9, 2, 6, 10, 5, 10, 3, 6, 4, 9, 8, 3, 10 ] );
			expect(reel2.modifyReelData).toHaveBeenCalledWith( [ 2, 9, 6, 2, 7, 4, 10, 1, 7, 6, 9, 2, 7, 4, 6, 10, 9 ] );
			expect(reel3.modifyReelData).toHaveBeenCalledWith( [ 12, 12, 10, 9, 8, 5, 9, 7, 8, 3, 2, 10, 8, 10, 5, 7, 6 ] );
			expect(reel4.modifyReelData).toHaveBeenCalledWith( [ 12, 8, 9, 10, 4, 1, 9, 4, 8, 3, 8, 3, 1, 8, 5, 3, 4 ] );
			expect(reel5.modifyReelData).toHaveBeenCalledWith( [ 9, 2, 8, 1, 4, 9, 5, 7, 2, 4, 8, 1, 3, 6, 2, 7, 4 ] );
		});

		it("Given a slotInitResponse and stop are: [9, 17, 100, 116, 65] serverSpinStart should queue up slot stops correctly", function() {
			spyOn(this.class, "spinReels");

			var Reel = function() {
				return {
					modifyReelData: jasmine.createSpy("modify reel data spy")
				};
			};

			var reel1 = new Reel();
			var reel2 = new Reel();
			var reel3 = new Reel();
			var reel4 = new Reel();
			var reel5 = new Reel();

			this.class.reels = [reel1, reel2, reel3, reel4, reel5];


			var spinResponseVO = {
				spinRecords: [{
					stops: [9, 17, 100, 116, 65]
				}]
			};

			this.class.serverSpinStart(spinResponseVO);

			expect(this.class.spinReels).toHaveBeenCalledWith([8,8,8,8,8]);


		});

		it("Given a slotInitResponse and stop are: [135, 101, 78, 2, 32] serverSpinStart should queue up slot stops correctly", function() {
			spyOn(this.class, "spinReels");

			var Reel = function() {
				return {
					modifyReelData: jasmine.createSpy("modify reel data spy")
				};
			};

			var reel1 = new Reel();
			var reel2 = new Reel();
			var reel3 = new Reel();
			var reel4 = new Reel();
			var reel5 = new Reel();

			this.class.reels = [reel1, reel2, reel3, reel4, reel5];

			var spinResponseVO = {
				spinRecords: [{
					stops: [135, 101, 78, 2, 32]
				}]
			};

			this.class.serverSpinStart(spinResponseVO);

			expect(this.class.spinReels).toHaveBeenCalledWith([8,8,8,8,8]);
		});

	});



});