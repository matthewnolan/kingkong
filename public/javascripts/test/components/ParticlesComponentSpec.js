/*! kingkong 0.2.2 - 2015-02-26
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("ParticlesComponent Test", function () {

	beforeEach(function () {

		this.class = new G.ParticlesComponent();

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.ParticlesComponent));
	});

	xit("Class vars are initialised correctly", function () {
		expect(this.class.classVar).toBeDefined();
	});

});