var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    'babel-polyfill',
    './src/index.jsx'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  target: 'node-webkit',
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      platform: path.resolve(__dirname, 'src/platform/nw/')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader/useable', 'css-loader', 'less-loader']
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin([
      { from: 'resources/nw/package.json' },
      { from: 'resources/nw/index.html' }
    ])
  ]
};
