const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname,'./src/client/index.js'),
  output: {
    path: path.resolve(__dirname, './dist/client'),
    filename: 'webpack.client.bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
};
