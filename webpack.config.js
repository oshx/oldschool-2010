const HtmlWebpackPlugin = require('html-webpack-plugin');

var path = require('path'),
    join = path.join,
    MiniCSSExtractPlugin = require('mini-css-extract-plugin'),
    HTMLWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    publicPath: '/oldschool-2010/',
    path: join(__dirname, './docs'),
    filename: 'main.min.js'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HTMLWebPackPlugin({
      template: './src/templates/index.html'
    }),
    new MiniCSSExtractPlugin({
      filename: '[name].min.css',
      chunkFilename: '[id].[contenthash].css'
    })
  ]
};
