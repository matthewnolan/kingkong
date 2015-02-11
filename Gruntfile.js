/*global module:false*/
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
		jasmine: {
			src: 'public/javascripts/app/**/*.js',
			options: {
				specs: 'public/javascripts/test/**/*.js',
				vendor: 'public/javascripts/vendor/**/*.js',
				version: '2.1.3',
				keepRunner: true
			}
		},

		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: ['public/javascripts/app/**/*.js'],
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
					"require" : false,
					"console" : false,
					"Hammer" : true,
					"$" : true
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
				tasks: ['jshint', 'jasmine:build']
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

	// Bespoke Grunt Tasks
	grunt.loadTasks('./modules/gruntTasks/');

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

	// chosse a documentation tool
	grunt.loadNpmTasks('grunt-contrib-yuidoc');

	// Default task.

	grunt.registerTask('build', ['jasmine', 'jshint', 'concat', 'uglify', 'yuidoc']);
	grunt.registerTask('patch', ['jasmine', 'jshint', 'bump:patch', 'concat', 'uglify', 'yuidoc']);
	grunt.registerTask('minor', ['jasmine', 'jshint', 'bump:minor', 'concat', 'uglify', 'yuidoc']);
	grunt.registerTask('release', ['jasmine', 'jshint', 'bump:major', 'concat', 'uglify', 'yuidoc']);
	grunt.registerTask('texture', ['easel-packer']);
	grunt.registerTask('doc', ['yuidoc']);
	grunt.registerTask('docs', ['yuidoc']);
	grunt.registerTask('add', ['prompt:file-creator', 'file-creator']);


};
