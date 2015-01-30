/*global module:false*/
var appTemplates = require('./modules/appTemplates.js');
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
		// Task configuration.
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: ['lib/FILE_NAME.js'],
				dest: 'dist/FILE_NAME.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'dist/FILE_NAME.min.js'
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
					jQuery: true
				}
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			lib_test: {
				src: ['lib/**/*.js', 'test/**/*.js']
			}
		},
		qunit: {
			files: ['test/**/*.html']
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			lib_test: {
				files: '<%= jshint.lib_test.src %>',
				tasks: ['jshint:lib_test', 'qunit']
			}
		},

		"file-creator": {
			"conditional": {
				files: [
					{
						file: "public/javascripts/app/src/" + '<%= config.file %>.js',
						method: function (fs, fd, done) {
							var templateFunction, args;
							var includeInit = grunt.template.process('<%= config.includeInit %>') === 'true';
							if (grunt.template.process('<%= config.shouldExtend %>') === 'true') {
								templateFunction = appTemplates.classExtend;
								var str = grunt.template.process('<%= config.superFull %>');
								args = {
									includeInit: includeInit,
									superClass: str.split('.')[1]
								}
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
							message: 'Name Super class including namespace (eg. G.Button)',
							default: 'value',
							validate: function (value) {
								if (value.length && value.indexOf('.') >= 1) {
									return true;
								} else {
									return "Please include namespace (eg. createjs.Container)";
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

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-file-creator');
	grunt.loadNpmTasks('grunt-prompt');

	// Default task.
	grunt.registerTask('add', ['prompt:file-creator', 'file-creator']);


};