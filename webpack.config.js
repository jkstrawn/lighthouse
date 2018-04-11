/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var webpack = require("webpack");
var path = require('path');

var config = {
	cache: true,
	devtool: "source-map",
	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			},
			{
				test: /\.css$/,
				loader: "style-loader!css-loader"
			}]
	},
	plugins: [
		new webpack.ProvidePlugin({
			THREE: "three",
			$: "jquery",
		})
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		unsafeCache: true
	}
};

var clientConfig = Object.assign({}, config, {
	name: "game",
	target: 'node', // in order to ignore built-in modules like path, fs, etc. 
    // externals: [nodeExternals()],
	context: path.resolve(__dirname, './src/react'),
	//	context: path.resolve(__dirname, './src/public/scripts'),
	output: {
		path: path.resolve(__dirname, './src'),
		filename: 'output.js'
	},
	entry: [
		'./boot.tsx'
		//		'./main.ts'
	]
});

// Return Array of Configurations
module.exports = [
	clientConfig
];