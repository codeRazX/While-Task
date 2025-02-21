const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    watchFiles: ["./src/index.html"],
    open: true, 
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          'style-loader', 
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader', 
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
});