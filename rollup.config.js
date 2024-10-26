export default [
	{
		input: './.dist/app.suduku/src/app.suduku.js',
		output: {
			format: 'es',
			file: './.rollup/app.suduku.js',
			paths: {
				'@zone09.net/foundation': './lib.foundation.js',
				'@zone09.net/paperless': './lib.paperless.js',
				'@zone09.net/hac': './lib.hac.js',
				'@extlib/matter': './extlib/matter-0.20.0.min.js',
				'@extlib/poly-decomp': './extlib/poly-decomp-0.2.1.min.js',
				'@extlib/intersects': './extlib/intersects-2.7.1.min.js',
				'@extlib/sudukogen': './extlib/sudukugen-1.0.2.min.js'
			 }
		},
	},
]
