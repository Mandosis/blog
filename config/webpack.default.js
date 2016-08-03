const webpack = require('webpack');
const path = require('path');
const helpers = require('./helpers');

// Default config
module.exports = {
  context: __dirname,
  resolve: {
    root: helpers.root('../src')
  },
  output: {
    publicPath: path.resolve(__dirname),
    filename: 'index.js'
  }
}
