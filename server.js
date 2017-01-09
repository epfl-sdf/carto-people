const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
app.use(compression());
app.use(cors());

/* eslint-disable global-require */
if (!isProduction) {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config');

  const compiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath,
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}
/* eslint-enable global-require */

// serve static assets normally
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Handles all routes so you do not get a not found error
app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server running at localhost:${PORT}`);
});
