/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("Preloader Test", function () {

	beforeEach(function () {

		this.class = new G.Preloader();

	});

	it("Passing Test", function () {
		expect(this.class).toBeDefined();
	});

	it("Failing Test", function () {
		expect(false).toBeTruthy();
	});
});