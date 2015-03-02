/*! kingkong 0.2.2 - 2015-03-02
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("MeterComponent Test", function () {

	beforeEach(function () {

		this.class = new G.MeterComponent();

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.MeterComponent));
	});

	xit("Class vars are initialised correctly", function () {
		expect(this.class.classVar).toBeDefined();
	});

});