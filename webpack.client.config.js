const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  let socketUrl;
  if (argv.mode === 'development') {
    socketUrl = JSON.stringify('http://localhost:3000');
  } else if (argv.mode === 'production') {
    //nothing
  }
  return {
    entry: path.resolve(__dirname,'./src/client/index.js'),
    output: {
      path: path.resolve(__dirname, './dist/client'),
      filename: 'webpack.client.bundle.js'
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new webpack.DefinePlugin({
        __SOCKET_URL__: socketUrl
      })
    ]
  };
};
