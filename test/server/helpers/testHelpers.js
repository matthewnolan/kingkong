var Table = require('cli-table');
var spriteMap =  ["ww","m1", "m2", "m3", "m4", "f5", "f6", "f7", "f8", "f9", "f0", "d1", "d2", "d3", "d4", "b1", "b2", "r"];

var TestHelpers =  {
	drawReelStripsAtStopIndex: function(reelStrips, stopIndex, useSymbolVal) {
		var i, j, len = reelStrips.length, strip;
		var head = ["Stop"];
		var body = [];
		var reelHeight = 3;
		var colWidth = 15;
		var colWidths = [colWidth-8];
		var strips = [];
		for (i = 0; i < len; i++) {
			head.push("ReelStrip[" + i + "]");
			strip = reelStrips[i].slice(stopIndex, stopIndex + reelHeight);
			strips.push(strip);
			colWidths.push(colWidth);
		}
		var table = new Table({
			head: head,
			colWidths: colWidths
		});
		for (j = 0; j < reelHeight; j++) {
			body[j] = [j + stopIndex];
			for (i = 0; i < strips.length; i++) {
				body[j].push(useSymbolVal? spriteMap[strips[i][j]] : strips[i][j]);
			}
			table.push(body[j]);
		}
		return table;
	}
};


module.exports = TestHelpers;