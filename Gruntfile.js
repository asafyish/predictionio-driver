'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'index.js',
				'lib/{,*/}*.js',
				'test/{,*/}*.js'
			]
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['test/**/*.js']
			}
		}
	});

	grunt.registerTask('test', [
		'mochaTest'
	]);

	grunt.registerTask('default', [
		'jshint',
		'test'
	]);
};
