global.Promise         = require('bluebird');

var webpack            = require('webpack');
var path               = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var publicPath         = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8050/public/assets';
var jsName             = process.env.NODE_ENV === 'production' ? 'bundle-[hash].js' : 'bundle.js';

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER:  JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new CleanWebpackPlugin([ 'public/assets/' ], {
      root: __dirname,
      verbose: true,
      dry: false
    })
  );
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.optimize.OccurenceOrderPlugin());
}

module.exports = {
  entry: ['babel-polyfill', './src/client'],
  debug: process.env.NODE_ENV !== 'production',
  resolve: {
    alias: { 'react/lib/ReactMount': 'react-dom/lib/ReactMount' },
    root:               path.join(__dirname, 'src'),
    modulesDirectories: ['node_modules'],
    extensions:         ['', '.js', '.jsx']
  },
  plugins,
  output: {
    path: `${__dirname}/public/assets/`,
    filename: jsName,
    publicPath
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'react-hot!babel', exclude: [/node_modules/, /public/] }
    ]
  },
  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : null,
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
};
