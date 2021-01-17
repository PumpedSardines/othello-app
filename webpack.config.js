const path = require('path');
const WebpackOnBuildPlugin = require('on-build-webpack');

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
		/*plugins: [
			new WebpackOnBuildPlugin(() => {
				if (prod) {
					const fs = require('fs');

					fs.readdir("./public/", (err, files) => {
						files.forEach(file => {
							if (file.match(/.js$/)) {
								return
							}

							fs.copyFileSync(`./public/${file}`, `./build/${file}`, (err) => {
								if (err) throw err;
								console.log('source.txt was copied to destination.txt');
							});
						});
					});
				}
			}),
		],*/
		output: {
			filename: 'bundle.min.js',
			path: path.resolve(__dirname, prod ? "build" : 'public'),
		}
	}
};
