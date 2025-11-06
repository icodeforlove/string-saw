// Simple Rollup config to produce a single-file browser bundle
// Uses already-compiled ESM output as input to avoid extra plugins
export default {
	input: 'dist/esm/index.js',
	output: {
		file: 'dist/browser/saw.js',
		format: 'iife',
		name: 'stringSaw', // window.stringSaw()
		sourcemap: false
	},
	treeshake: false
};


