
module.exports = [
	{
		mode: 'production',

		target: 'web',

		entry: `${__dirname}/index`,

		output: {
			path: `${__dirname}/dist/browser`,
			filename: 'saw.js',
			library: 'Saw'
		},

		module: {
			rules: [
				{
					test: /\.js$/,
				    use: {
						loader: 'babel-loader',
						options: {
							presets: [
								require('babel-preset-es2015'),
								require('babel-preset-stage-0')
							],
							plugins: [
								require('babel-plugin-transform-decorators-legacy').default,
								require('babel-plugin-transform-decorators'),
								require('babel-plugin-transform-class-properties'),
								require('babel-plugin-add-module-exports'),
							]
						}
					}
				}
			]
		},

		devtool: 'source-map'
	},

	{
		target: 'node',
		mode: 'production',

		node: {
			__dirname: false,
			__filename: false
		},

		entry: `${__dirname}/index`,

		output: {
			path: `${__dirname}/dist/node`,
			filename: 'saw.js',
			libraryTarget: 'commonjs2'
		},

		externals: [require('webpack-node-externals')()],

		module: {
			rules: [
				{
					test: /\.js$/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								require('babel-preset-es2015'),
								require('babel-preset-stage-0')
							],
							plugins: [
								require('babel-plugin-transform-decorators-legacy').default,
								require('babel-plugin-transform-decorators'),
								require('babel-plugin-transform-runtime'),
								require('babel-plugin-transform-class-properties'),
								require('babel-plugin-add-module-exports'),
							]
						}
					}
				}
			]
		},

		devtool: 'source-map'
	}
];