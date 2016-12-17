const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');

const config = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    `${APP_DIR}/index.jsx`,
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.jsx', '.js'],
  },
  plugins: [
    // Ensures consistent build hashes
    new webpack.optimize.OccurenceOrderPlugin(),
    // Self-explanatory
    new webpack.HotModuleReplacementPlugin(),
    // Used to handle errors more cleanly
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loaders: ['react-hot', 'babel'],
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ],
  },
};

module.exports = config;
