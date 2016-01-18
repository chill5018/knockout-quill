module.exports = {
  entry: './src/knockout-quill.js',
  output: {
    filename: 'knockout-quill.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
  externals: {
    "quill": "Quill"
  }
};
