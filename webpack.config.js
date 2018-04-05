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
		extensions: ['.ts', '.tsx', '.js', 'jsx'],
		unsafeCache: true
	}
};

// Return Array of Configurations
module.exports = [
	clientConfig
];