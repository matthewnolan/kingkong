/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("Command Test", function () {

	beforeEach(function () {

		this.class = new G.Command();

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.Command));
	});

	it("Class vars are initialised correctly", function () {
		expect(this.class.loopIndex).toBe(0);
		expect(this.class.callNextDelay).toBe(2000);
	});

});