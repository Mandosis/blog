const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const defaultConfig = require('./webpack.default');
const helpers = require('./helpers');

clientConfig = {
  target: 'web',
  entry: {
    main: '../src/client/client',
    vendor: '../src/client/vendor'
  },
  output: {
    filename: '[name].bundle.js',
    path: helpers.root('../dist/client')
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'].reverse()
    }),

    new webpack.ProvidePlugin({
      CodeMirror: 'codemirror'
    })


  ],
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false
  }
};


var serverConfig = {
  target: 'node',
  entry: '../src/server/server', // use the entry file of the node server if everything is ts rather than es5
  output: {
    path: helpers.root('../dist'),
    filename: 'server.js',
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
