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
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
      }
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({template: './src/client/index.html'}),
      new webpack.DefinePlugin({
        __SOCKET_URL__: socketUrl
      })
    ]
  };
};
