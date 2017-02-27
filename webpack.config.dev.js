var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['react-hot-loader/patch',
          'webpack-hot-middleware/client',
          './app.js'
  ],
  output: {
    path: '/',
    filename: '[name].js',
    publicPath: 'http://localhost:3000/'
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.tmpl'),
        inject: true,
        hash: false,
        filename: 'index.html',
        minify: false,
        favicon: false,
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: 'css-loader',
        use: ExtractTextPlugin.extract({
          use:'css-loader'
        })
      },
      {
        test: /\.css$/,
        use: 'css-loader',
        use: ExtractTextPlugin.extract({
          use:'css-loader'
        })
      },
      {
        test: /\.js$/,
        loaders: [ 'babel-loader' ],
        exclude: /node_modules/,
        include: __dirname
      },
    ]
  }
}
