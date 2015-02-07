/*! kingkong 0.0.1 - 2015-02-07
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("WinLine Test", function () {

	beforeEach(function () {

		this.class = new G.WinLine();

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.WinLine));
	});

	xit("Class vars are initialised correctly", function () {
		expect(this.class.classVar).toBeDefined();
	});

});