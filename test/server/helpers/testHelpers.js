var Table = require('cli-table');
var spriteMap =  ["ww","m1", "m2", "m3", "m4", "f5", "f6", "f7", "f8", "f9", "f0", "d1", "d2", "d3", "d4", "b1", "b2", "r"];

var TestHelpers =  {
	drawReelStripsAtStops: function(reelStrips, stops, useSymbolVal) {
		var i, j, len = reelStrips.length, strip;
		var head = [""];
		var body = [];
		var reelHeight = 3;
		var colWidth = 15;
		var colWidths = [colWidth - 5];
		var stopIndex;
		var strips = [];
		for (i = 0; i < len; i++) {
			stopIndex = stops[i];
			head.push("Strip" + i + " [" + stopIndex + "]");
			strip = reelStrips[i].slice(stopIndex, stopIndex + reelHeight);
			strips.push(strip);
			colWidths.push(colWidth);
		}
		var table = new Table({
			head: head,
			colWidths: colWidths
		});
		for (j = 0; j < reelHeight; j++) {
			body[j] = [j];
			for (i = 0; i < strips.length; i++) {
				body[j].push(useSymbolVal? spriteMap[strips[i][j]] : strips[i][j]);
			}
			table.push(body[j]);
		}
		return table;
	}
};


module.exports = TestHelpers;