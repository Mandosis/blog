const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const defaultConfig = require('./webpack.default');
const helpers = require('./helpers');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

var clientConfig = {
  debug: false,
  target: 'web',
  entry: {
    polyfills: '../src/client/polyfills.ts',
    // vendor: '../src/client/vendor.ts',
    main: '../src/client/client.ts'
  },
  output: {
    filename: '[name].js',
    path: helpers.root('../dist/client')
  },
  plugins: [

    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),

    /**
     * Plugin: DedupePlugin
     * Description: Prevents the inclusion of duplicate code into your bundle
     * and instead applies a copy of the function at runtime.
     */
    new DedupePlugin(),

    new UglifyJsPlugin({
      beautify: false,
      mangle: { screw_ie8 : true },
      compress: { screw_ie8: true },
      comments: false
    }),

  ],
  node: {
    global: 'window',
    crypto: 'empty',
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};

var serverConfig = {
  debug: false,
  target: 'node',
  entry: '../src/server/server', // use the entry file of the node server if everything is ts rather than es5
  output: {
    path: helpers.root('../dist'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  externals: helpers.checkNodeImport,

  plugins: [
    /**
     * Plugin: DedupePlugin
     * Description: Prevents the inclusion of duplicate code into your bundle
     * and instead applies a copy of the function at runtime.
     */
    new DedupePlugin(),

  ],
  node: {
    global: 'window',
    crypto: 'empty',
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};

module.exports = [
  // Client
  webpackMerge({}, defaultConfig, commonConfig, clientConfig),

  // Server
  webpackMerge({}, defaultConfig, commonConfig, serverConfig)

]
