const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const HASH = '[chunkHash]'
const PROD = process.env.NODE_ENV === 'production'

module.exports = {

  devtool: 'source-map',

  entry: {
    app: path.join(__dirname, 'index.js'),
    vendor: [ 'react', 'react-dom', 'react-history' ]
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: `bundle-${HASH}.js`,
    chunkFileName: `[name]-${HASH}.js`,
    pubicPath: PROD ? 'build/' : ''
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', `vendor-${HASH}.js`),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html.ejs')
    })
  ].concat(PROD ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ] : []),

  resolve: {
    alias: {
      'react-history': path.join(__dirname, '..', 'modules')
    }
  },

  module: {
    loaders: [
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
     },
    ]
  },

  devServer: {
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    stats: {
      assets: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: true
    }
  }
}
