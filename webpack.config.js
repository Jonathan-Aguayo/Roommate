const path = require('path');
require('dotenv').config();
const webpack = require('webpack');
module.exports = {
  mode:'development',
  devtool:'source-map',
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: ['./App.jsx'],
  },
 optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|whatwg-fetch|react-router)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: '[name].bundle.js',
    publicPath:'/'
  },
  devServer: 
  {
    historyApiFallback:true,
    port: 8000,
    contentBase: 'static',
    proxy: 
    {
      '/api/*': {target: 'http://localhost:3000'},
      '/auth/*': {target:'http://localhost:3000'},
    }
  },
  plugins:[
    new CopyWebpackPlugin({
      patterns:[
        {from:''}
      ]
    })
  ],
  module:
  {
    rules: [
        {
            test: /\.jsx$/,
            use: ['babel-loader'],
        }
    ]
  },

};