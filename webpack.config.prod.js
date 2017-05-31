const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "dev"
});
module.exports = {
  entry: {
    main: './app/app.js',
    vendor: ['react', 'redux', 'react-redux', 'react-router']
  },
  output: {
    path: __dirname + '/static',
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new ExtractTextPlugin('[name].[chunkhash].css'),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './app/index.tmpl'),
        inject: true,
        hash: false,
        filename: 'index.html',
        minify: true,
        favicon: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
       // 在UglifyJs删除没有用到的代码时不输出警告
       warnings: false,
       // 删除所有的 `console` 语句
       drop_console: true,
       // 内嵌定义了但是只用到一次的变量
       collapse_vars: true,
       // 提取出出现多次但是没有定义成变量去引用的静态值
       reduce_vars: true,
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: extractSass.extract({
            use: [{
                loader: "css-loader"
            }, {
                loader: "sass-loader"
            }],
            fallback: "style-loader"
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
        exclude: /(node_modules|quagga\.js)/,
        include: __dirname
      },
    ]
  }
}
