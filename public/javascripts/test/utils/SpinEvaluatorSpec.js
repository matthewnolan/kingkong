/*! kingkong 0.3.1 - 2015-03-23
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("SpinEvaluator Test", function () {

	beforeEach(function () {

		this.class = new G.SpinEvaluator();

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.SpinEvaluator));
	});

	xit("Class vars are initialised correctly", function () {
		expect(this.class.classVar).toBeDefined();
	});

});