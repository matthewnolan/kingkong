//core test framework
var assert = require("assert");
var _ = require('lodash');
var chai = require('chai');
var expect = require('chai').expect;
var Table = require('cli-table');

//test helpers
var helpers = require("./../helpers/testHelpers");

//unit under test
var slotInit = require("../../../routes/server/requests/slotInit");



describe('SlotInit tests', function(){
	describe('Reel Strips:', function(){

		var strip0 = slotInit.reelStrips[0];
		var strip1 = slotInit.reelStrips[1];
		var strip2 = slotInit.reelStrips[2];
		var strip3 = slotInit.reelStrips[3];
		var strip4 = slotInit.reelStrips[4];
		var table;

		beforeEach(function() {

		});

		it('Log reelStrips at 0 position', function(){
			table = helpers.drawReelStripsAtStopIndex(slotInit.reelStrips, 0, true);
			console.log(table.toString());
		});


		it('test middle reel strip symbol at stop 55 is correct', function(){
			table = helpers.drawReelStripsAtStopIndex(slotInit.reelStrips, 55, true);
			console.log(table.toString());
			expect(strip2[55]).to.equal(14)

		});

		it('test reel strips are correct size', function() {
			expect(strip0.length).to.equal(90);
			expect(strip1.length).to.equal(96);
			expect(strip2.length).to.equal(92);
			expect(strip3.length).to.equal(93);
			expect(strip4.length).to.equal(95);
		});


	})
});