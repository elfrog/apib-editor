var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: [
    './src/index.jsx'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      platform: path.resolve(__dirname, 'src/platform/web/')
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
        use: [
          { loader: 'style-loader', options: { injectType: 'lazyStyleTag' } },
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    port: 8080
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
