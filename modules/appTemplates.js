var AppTemplates = {
	testSpec: function() {
		/*
		 it("Passing Test", function() {

		 expect(this.class).toBeDefined();

		 });
		 */
		var contents = 'describe("<%= config.file %> Test", function () {\n\n';
		contents+='\tbeforeEach(function () {\n\n';
		contents+='\t\tthis.class = new G.<%= config.file %>();\n\n';
		contents+='\t});\n\n';
		contents+='\tit("Passing Test", function () {\n\n';
		contents+='\t\texpect(this.class).toBeDefined();\n\n';
		contents+='\t});\n';
		contents+='\tit("Failint Test", function () {\n\n';
		contents+='\t\texpect(false).toBeTruthy();\n\n';
		contents+='\t});\n';
		contents+='});';
		return contents;
	},

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
