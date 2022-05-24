const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
module.exports = {
  plugins: [
    new WebpackBuildNotifierPlugin({
      title: 'Eureka Project',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['postcss-loader'],
      },
    ],
  },
};
