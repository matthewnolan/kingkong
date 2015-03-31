/*! kingkong 0.3.0 - 2015-03-17
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("CustomCommand Test", function () {

	beforeEach(function () {

		this.class = new G.CustomCommand();

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.CustomCommand));
	});

	xit("Class vars are initialised correctly", function () {
		expect(this.class.classVar).toBeDefined();
	});

});