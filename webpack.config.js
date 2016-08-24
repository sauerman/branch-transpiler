module.exports = {
  entry: {
    index: './src/index.js'
  },

  module: {
    loaders: [
      {test: /\.js$/, loaders: ['babel-loader']}
    ],
  },
};