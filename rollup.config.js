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
				'@extlib/sudukogen': './extlib/./extlib/sudukugen-1.0.2.js',
			 }
		},
	},
]
