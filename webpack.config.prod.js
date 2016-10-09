const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: path.join(__dirname, 'src/index.js'),
    vendor: ['react', 'react-router'],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.[chunkhash].js',
    chunkFilename: '[id].[chunkhash].js',
  },
  devtool: null,
  module: {
     // noParse: [path.join(nodeModulesPath, '/react/dist/react.min')],
     loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader'),
      },
      // {
      //   test: /\.less$/,
      //   loaders: ['style', 'css', 'less'],
      // },
      {
        test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
        loader: 'url?limit=25000',
      },
     ]
  },
  postcss: function() {
    return [precss, autoprefixer];
  },
  plugins: [
    new ExtractTextPlugin('[name].[contenthash:20].css'),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[chunkhash].js'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
      inject: 'body',
    }),
  ],
  resolve: {
    extensions: ['', '.web.js', '.js', '.jsx', '.json', '.css', '.less', '.scss'],
  },
};
