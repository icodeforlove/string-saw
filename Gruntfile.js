module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		webpack: {
			build: {
				devtool: 'source-map',
				entry: './index.js',
				output: {
					library: 'saw',
					path: 'dist/',
					filename: 'saw.js'
				}
			}
		},

		uglify: {
			build: {
				files: {
					'dist/saw-min.js': ['dist/saw.js']
				}
			}
		},

		banner: '/**\n * saw.js v<%= pkg.version %>\n */',
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					'dist/saw.js': ['dist/saw.js'],
					'dist/saw-min.js': ['dist/saw-min.js']
				}
			}
		},

		jshint: {
			options: {
				jshintrc: true
			},
			all: ['./*.js', './test/*.js']
		},

		jasmine_node: {
			options: {
				forceExit: true,
				match: '.',
				matchall: false,
				extensions: 'js',
				specNameMatcher: 'test'
			},
			all: ['test/']
		},
		watch: {
			jasmine: {
				files: ['test/*.js'],
				tasks: ['test']
			}
		}
	});

	grunt.loadNpmTasks('grunt-webpack');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-banner');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jasmine-node');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', ['jshint', 'webpack', 'uglify', 'usebanner']);
	grunt.registerTask('test', ['jshint', 'jasmine_node']);
};