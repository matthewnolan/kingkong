/*! kingkong 0.2.3 - 2015-03-05
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("GameData Test", function () {

	beforeEach(function () {

		this.class = new G.GameData();

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.GameData));
	});

	xit("Class vars are initialised correctly", function () {
		expect(this.class.classVar).toBeDefined();
	});

});