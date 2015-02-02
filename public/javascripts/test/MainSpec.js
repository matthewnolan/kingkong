/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("Main Test", function () {

	beforeEach(function () {

		this.class = new G.Main();

	});

	it("Passing Test", function () {

		expect(this.class).toBeDefined();

	});
	it("Failint Test", function () {

		expect(false).toBeTruthy();

	});
});