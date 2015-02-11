/*! kingkong 0.0.6 - 2015-02-11
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("SymbolWinsComponent Test", function () {

	beforeEach(function () {

		this.class = new G.SymbolWinsComponent();

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.SymbolWinsComponent));
	});

	xit("Class vars are initialised correctly", function () {
		expect(this.class.classVar).toBeDefined();
	});

});