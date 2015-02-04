/*! kingkong 0.0.1 - 2015-02-04
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("Reel Test", function () {

	beforeEach(function () {

		this.class = new G.Reel();

	});

	it("Passing Test", function () {
		expect(this.class).toBeDefined();
	});

	it("Failing Test", function () {
		expect(false).toBeTruthy();
	});
});