const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');

const env = dotenv.config().parsed;

// https://medium.com/@trekinbami/using-environment-variables-in-react-6b0a99d83cf5
const envKeys = Object.keys(env).reduce(
  (acc, cur) => ({ ...acc, [`process.env.${cur}`]: JSON.stringify(env[cur]) }),
  {},
);

envKeys['process.env.LIVE_API'] = process.env.LIVE_API === 'yesplease';

module.exports = {
  entry: ['react-hot-loader/patch', './src/index.tsx'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.ts(x)?$/,
        use: ['awesome-typescript-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: 'file-loader',
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
            },
          },
        ],
      },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
  },
  // define plugin + node handle .env variable replacement
  plugins: [new webpack.DefinePlugin(envKeys)],
  node: { fs: 'empty' },
  devtool: 'source-map',
};
