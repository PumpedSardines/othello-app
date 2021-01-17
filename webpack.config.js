const path = require('path');

module.exports = (env, argv) => {
	const prod = argv.mode === 'production';

	return {
		entry: './src/index.js',
		module: {
			rules: [
				{
					test: /\.worker\.js$/,
					loader: "worker-loader",
					options: {
						filename: () => {
							if (prod) {
								return "[contenthash].worker.js"
							}

							return "[name].js"
						}
					},
				},
			],
		},
		output: {
			filename: 'bundle.min.js',
			path: path.resolve(__dirname, prod ? "build" : 'public'),
		}
	}
};
