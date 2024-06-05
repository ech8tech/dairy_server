const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: {
    app: path.resolve('src', 'index.ts')
  },
  output: {
    filename: 'index.js',
    path: path.resolve('dist'),
    publicPath: ''
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.js']
  },
  externals: {
    sqlite3: 'commonjs sqlite3',
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      APP_ENV: JSON.stringify('production'),
    }),
  ],
};
