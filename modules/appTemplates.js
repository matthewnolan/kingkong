var AppTemplates = {

	classSolo: function (args) {

		var contents = 'var G = G || {};\n\n';
		contents += '(function () {\n';
		contents += '\t"use strict";\n\n';
		contents += '\tvar <%= config.file %> = function() {};\n';
		contents += '\tvar p = <%= config.file %>.prototype;\n';
		contents += '\tp.constructor = <%= config.file %>;\n\n\n';
		if (args.includeInit) contents += '\tp.init = function() { \n\n';
		if (args.includeInit) contents += '\t};\n\n';
		contents += '\tG.<%= config.file %> = <%= config.file %>;\n\n';
		contents += '})();';
		return contents;
	},

	classExtend: function (args) {
		var contents = 'var G = G || {};\n\n';
		contents += '(function () {\n';
		contents += '\t"use strict";\n\n';
		contents += '\tvar <%= config.file %> = function() {};\n';
		contents += '\tvar p = createjs.extend(<%= config.file %>, <%= config.superFull %>);\n';
		contents += '\tp.constructor = <%= config.file %>;\n\n\n';
		if (args.includeInit) contents += '\tp.init = function() { \n\n';
		if (args.includeInit) contents += '\t};\n\n';
		contents += '\tG.<%= config.file %> = createjs.promote(<%= config.file %>, "' + superClass + '");\n\n';
		contents += '})();';
		return contents;
	}
};

module.exports = AppTemplates;
