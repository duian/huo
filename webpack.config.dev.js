const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // devtool: 'source-map',
  devtool: 'eval-source-map',
  // devtool: 'cheap-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    // publicPath: '/static/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src'),
      },
      // {
      //   test: /\.jsx?$/,
      //   loader: 'eslint',
      //   exclude: /node_modules/,
      // },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass'],
      },
      {
        test: /\.less$/,
        loaders: ['style', 'css', 'less'],
      },
      {
        test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
        loader: 'url?limit=25000',
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // new webpack.ProvidePlugin({
    //   'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    // }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
      inject: 'body',
    }),
  ],
  resolve: {
    extensions: ['', '.web.js', '.js', '.jsx', '.json', '.css', '.less', '.scss'],
    modulesDirectories: [
      'node_modules',
    ],
  },
};
