const webpack = require('webpack'); //to access webpack runtime
const configuration = require('./webpack.config.js');
const fs = require('fs');


let compiler = webpack(configuration({}, { mode: "production" }));

new webpack.ProgressPlugin().apply(compiler);

compiler.run((err, stats) => {
	fs.readdir("./public/", (err, files) => {
		files.forEach(file => {
			if (file.match(/.js$/)) {
				return
			}

			fs.copyFileSync(`./public/${file}`, `./build/${file}`);
		});
	});
});
