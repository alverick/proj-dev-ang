const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
module.exports = {
  plugins: [
    new WebpackBuildNotifierPlugin({
      title: 'Eureka Project',
      suppressSuccess: true, // don't spam success notifications
    }),
  ],
};
