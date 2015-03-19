var assert = require("assert");
var slotInit = require("../../../routes/server/requests/slotInit");
var _ = require('lodash');
var chai = require('chai');
var expect = require('chai').expect;


describe('Array', function(){
	describe('#indexOf()', function(){
		it('should return correct strip position', function(){

			var strip1 = slotInit.reelStrips[0];

			console.log("strip1=", strip1);

			var intersection = _.intersection(strip1, [1,2,3,4,5]);

			console.log('intersection=', intersection);

		});


	})
});