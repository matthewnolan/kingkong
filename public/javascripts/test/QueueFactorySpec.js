/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("QueueFactory Test", function () {

	beforeEach(function () {

		this.class = new G.QueueFactory();

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.QueueFactory));
	});

	xit("Class vars are initialised correctly", function () {
		expect(this.class.classVar).toBeDefined();
	});

});