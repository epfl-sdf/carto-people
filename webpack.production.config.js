/* eslint-disable */
const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');

const config = {
  devtool: 'cheap-module-source-map',
  entry: `${APP_DIR}/index.jsx`,
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['', '.jsx', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      comments: false,
      sourceMap: false
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loaders: ['react-hot', 'babel?' + JSON.stringify({
          presets: ["es2015", "react"],
          plugins: ["transform-decorators-legacy", "transform-class-properties", [
            "import",
            {
              "libraryName": "antd",
              "style": "css"
            }
          ]]
        })]
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ],
  },
};

module.exports = config;
/* eslint-enable */
