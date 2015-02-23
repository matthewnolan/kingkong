/*global module:false */
var appTemplates = require('./modules/utils/appTemplates.js');
var change = require('./node_modules/change-case/change-case.js');

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			version: '<%= pkg.version %>'
		},
		banner: '/*! <%=pkg.name %> <%= meta.version %> - ' +
		'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		'* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
		'Licensed @HighFiveGames */\n',
		bump: {
			options: {
				files: ['package.json'],
				updateConfigs: ['pkg'],
				commit: false,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json'],
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false,
				pushTo: 'upstream',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
				globalReplace: false
			}
		},

		// Task configuration.
		// load order of source files is important, so start with any Super Types then load the whole app src
		jasmine: {
			src: [
				'public/javascripts/app/commands/Command.js',
				'public/javascripts/app/components/GameComponent.js',
				'public/javascript/app/utils/*.js',
				'public/javascripts/app/**/*.js'],
			options: {
				specs: 'public/javascripts/test/**/*.js',
				helpers: [
					"public/javascripts/vendor/js-imagediff/imagediff.js"
				],
				vendor: ['public/javascripts/vendor/easeljs/easeljs-0.8.0.combined.js', 'public/javascripts/vendor/**/*.js'],

				version: '2.1.3',
				host : 'http://127.0.0.1:<%=connect.phantom.options.port%>/',
				outfile : 'public/_SpecRunner.html',
				keepRunner: true
			}
		},

		connect: {
			serve: {
				options: {
					keepalive: false,
					base: [{
						path: __dirname,
						options:{
							index: 'public/_SpecRunner.html'
						}
					}, '..'],
					useAvailablePort: true,
					port: 8000,
					open: true
				}
			},
			phantom: {
				options: {
					base: [{
						path: __dirname,
						options:{
							index: 'public/_SpecRunner.html'
						}
					}, '..'],
					useAvailablePort: true,
					port: 8000
				}
			}
		},

		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: [
					// some source and vendor files need to be concatenated first.
					// So this list must sometimes be updated manually.
					// This is a bit of a pain, which we could avoid if we used Require.js or similar
					// i recommend we do this if (this pain > pain of refactoring modules to amd)

					//includes to concat (depended files first)
					'public/javascripts/vendor/easeljs/**/*.js',
					'public/javascripts/vendor/**/*.js',
					'public/javascripts/app/core/*.js',
					'public/javascripts/app/commands/Command.js',
					'public/javascripts/app/components/GameComponent.js',
					'public/javascripts/app/commands/*.js',
					'public/javascripts/app/components/*.js',
					'public/javascripts/app/Main.js',
					'public/javascripts/app/utils/*.js',

					//excludes (not required by application)
					'!public/javascripts/vendor/jasmine/**/*.js',
					'!public/javascripts/vendor/jasmine-signals/**/*.js',
					'!public/javascripts/vendor/jasmine-sinon/**/*.js',
					'!public/javascripts/vendor/sinonjs/**/*.js'
				],
				dest: 'public/javascripts/dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'public/javascripts/dist/<%= pkg.name %>.min.js'
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				unused: true,
				boss: true,
				eqnull: true,
				browser: true,
				globals: {
					"__dirname" : true,
					"G": true,
					"_" : true,
					"createjs" : true,
					"Stats" : true,
					"signals" : true,
					"jasmine" : false,
					"sinon" : false,
					"spyOn" : false,
					"spyOnSignal" : false,
					"expect"   : false,
					"describe"   : false,
					"xdescribe"   : false,
					"fdescribe"   : false,
					"it"         : false,
					"xit" 		 : false,
					"fit" 		 : false,
					"before"     : false,
					"beforeEach" : false,
					"after"      : false,
					"afterEach"  : false,
					"imagediff"  : false,
					"fail" : false,
					"require" : false,
					"console" : false,
					"Hammer" : true
				}
			},
			all: ['public/javascripts/app/**/*.js', 'public/javascripts/test/**/*.js'],
			gruntfile: {
				src: 'Gruntfile.js'
			}
		},
		watch: {
			scripts: {
				files: ['public/javascripts/app/**/*.js', 'public/javascripts/test/**/*.js'],
				tasks: ['test']
			},
			options: {
				spawn: true
			}
		},

		yuidoc: {
			compile: {
				name: '<%= pkg.name %>',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				url: '<%= pkg.homepage %>',
				options: {
					paths: 'public/javascripts/app/',
					themedir: 'src/yuidoc/themes/',
					outdir: 'public/doc/'
				}
			}
		},

		replace: {
			"version": {
				src: ['public/javascripts/app/core/Game.js'],
				overwrite: true,
				replacements: [{
					from: /{{ VERSION }}/g,
					to: "<%= pkg.version %>"
				}]
			}
		},


		"file-creator": {
			"create-class": {
				files: [
					{
						file: "public/javascripts/test/" + '<%= config.file %>Spec.js',
						method: function (fs, fd, done) {
							var templateFunction = appTemplates.testSpec;
							fs.writeSync(fd, grunt.template.process("<%= banner %>\n" + templateFunction.call(this)));
							done();
						}
					},
					{
						file: "public/javascripts/app/" + '<%= config.file %>.js',
						method: function (fs, fd, done) {
							var templateFunction, args;
							var includeInit = grunt.template.process('<%= config.includeInit %>') === 'true';
							if (grunt.template.process('<%= config.shouldExtend %>') === 'true') {
								templateFunction = appTemplates.classExtend;
								var str = grunt.template.process('<%= config.superFull %>');
								args = {
									includeInit: includeInit,
									superClass: str.split('.')[1]
								};
							} else {
								templateFunction = appTemplates.classSolo;
								args = {
									includeInit: includeInit
								};
							}
							fs.writeSync(fd, grunt.template.process("<%= banner %>\n" + templateFunction.call(this, args)));
							done();
						}
					}
				]
			}
		},

		prompt: {
			"file-creator": {
				options: {
					questions: [
						{
							config: 'config.file',
							type: 'input',
							message: 'Name your class',
							default: 'Use Spaces',
							filter: function (value) {
								return change.pascalCase(value);
							},
							validate: function (value) {
								if (value.length) {
									return true;
								}
							},
							when: function () {
								return true;
							}
						},
						{
							config: 'config.shouldExtend',
							type: 'confirm',
							message: 'Should extend another class?',
							default: 'N',
							when: function () {
								return true;
							}
						},
						{
							config: 'config.superFull',
							type: 'input',
							message: 'Name Super class including namespace (eg. createjs.Container)',
							default: 'value',
							validate: function (value) {
								if (value.length && value.indexOf('.') >= 1) {
									return true;
								} else {
									return "Write the global object.Class (eg. createjs.Container)";
								}
							},
							when: function (answers) {
								if (answers['config.shouldExtend'] === true) {
									return true;
								} else {
									return false;
								}
							}
						},
						{
							config: 'config.includeInit',
							type: 'confirm',
							message: 'Should include an init function',
							default: 'Y'

						}
					]
				}

			}
		}
	});

	// Bespoke Grunt Tasks (@hayes_maker)
	grunt.loadTasks('./modules/grunt/');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-file-creator');
	grunt.loadNpmTasks('grunt-prompt');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-text-replace');

	// documentation tool
	grunt.loadNpmTasks('grunt-contrib-yuidoc');

	//Defualt build tasks
	grunt.registerTask('default', 		  ['jshint']);
	grunt.registerTask('build', 		  ['jshint', 'phantom', 'temp-copy', 'replace:version', 'concat', 'uglify', 'yuidoc', 'temp-copy-return', 'copy-dev-index']);
	grunt.registerTask('build:prod', 	  ['jshint', 'phantom', 'temp-copy', 'replace:version', 'concat', 'uglify', 'yuidoc', 'temp-copy-return', 'copy-prod-index']);
	grunt.registerTask('build:skipTests', ['temp-copy', 'replace:version', 'concat', 'uglify', 'yuidoc', 'temp-copy-return', 'copy-prod-index']);
	//Do a build with bumped version numb
	grunt.registerTask('patch', 		  ['jshint', 'phantom', 'bump:patch', 'temp-copy', 'replace:version', 'concat', 'uglify', 'yuidoc', 'temp-copy-return', 'copy-dev-index']);
	grunt.registerTask('patch:prod', 	  ['jshint', 'phantom', 'bump:patch', 'temp-copy', 'replace:version', 'concat', 'uglify', 'yuidoc', 'temp-copy-return', 'copy-prod-index']);
	grunt.registerTask('feature', 		  ['jshint', 'phantom', 'bump:minor', 'temp-copy', 'replace:version', 'concat', 'uglify', 'yuidoc', 'temp-copy-return', 'copy-dev-index']);
	grunt.registerTask('feature:prod', 	  ['jshint', 'phantom', 'bump:minor', 'temp-copy', 'replace:version', 'concat', 'uglify', 'yuidoc', 'temp-copy-return', 'copy-prod-index']);
	grunt.registerTask('release', 		  ['jshint', 'phantom', 'bump:major', 'temp-copy', 'replace:version', 'concat', 'uglify', 'yuidoc', 'temp-copy-return', 'copy-dev-index']);
	grunt.registerTask('release:prod', 	  ['jshint', 'phantom', 'bump:major', 'temp-copy', 'replace:version', 'concat', 'uglify', 'yuidoc', 'temp-copy-return', 'copy-prod-index']);
	//development support
	grunt.registerTask('texture', ['easel-packer']);
	grunt.registerTask('doc', ['yuidoc']);
	grunt.registerTask('docs', ['yuidoc']);
	grunt.registerTask('add', ['prompt:file-creator', 'file-creator']);

	//Tests Only
	grunt.registerTask("phantom", "Launches phantom-based tests", ["connect:phantom", "jasmine"]);
	grunt.registerTask('test', 			['phantom']);
	grunt.registerTask('lint', 			['jshint']);


};
