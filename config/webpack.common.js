const webpack = require('webpack');
const helpers = require('./helpers');

module.exports = {
  resolve: {
    extensions: ['', '.ts', '.js', '.json']
  },
  module: {
    loaders: [
      // TypeScript
      { test: /\.ts$/, loaders: ['ts-loader', 'angular2-template-loader'] },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.json$/, loader: 'raw-loader' },
      { test: /\.scss$/, exclude: /node_modules/, loaders: ['raw-loader', 'sass-loader'] },
      { test: /\.pug$/, loader: 'pug-html-loader' }
    ],
    preLoaders: [
      // needed to lower the filesize of angular due to inline source-maps
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          // these packages have problems with their sourcemaps
          helpers.root('../node_modules/rxjs'),
          helpers.root('../node_modules/@angular'),
          helpers.root('../node_modules/@ngrx'),
          helpers.root('../node_modules/@angular2-material'),
        ],
      }
    ],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true)
  ]

};
