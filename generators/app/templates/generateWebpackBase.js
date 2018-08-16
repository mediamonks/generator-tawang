module.exports = ({ serverHost }) => `const path = require('path');
const Tawang = require('@mediamonks/tawang');

module.exports = {
  entry: path.resolve(__dirname, '../../src/script.js'),
  output: {
    path: path.resolve(__dirname, '../../build'),
    filename: 'main.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
    ],
  },
  plugins: [
    new Tawang({
      serverHost: '${serverHost}',
    }),
  ],
};`;
