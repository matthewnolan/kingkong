/*! kingkong 0.2.2 - 2015-03-02
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("Dj Test", function () {

	beforeEach(function () {

		this.class = new G.Dj();

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.Dj));
	});

	xit("Class vars are initialised correctly", function () {
		expect(this.class.classVar).toBeDefined();
	});

});