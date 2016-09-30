const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const defaultConfig = require('./webpack.default.js');

/**
 * Webpack Plugins
 */
// const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');


let clientConfig =  {
  debug: false,
  // devtool: 'source-map',
  entry: {
    main: '../src/client/client',
    vendor: '../src/client/vendor'
  },
  output: {
    filename: '[name].bundle.js',
    path: helpers.root('../dist/client'),
    // sourceMapFilename: '[name].bundle.map',
  },
  plugins: [
    new UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
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
  devtool: 'source-map',
  target: 'node',
  entry: '../src/server/server', // use the entry file of the node server if everything is ts rather than es5
  output: {
    path: helpers.root('../dist'),
    filename: 'server.js',
    sourceMapFilename: 'server.map',
    libraryTarget: 'commonjs2'
  },
  externals: helpers.checkNodeImport,
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  },
};

module.exports = [
  // Client
  webpackMerge({}, defaultConfig, commonConfig, clientConfig),

  // Server
  webpackMerge({}, defaultConfig, commonConfig, serverConfig)

];
