const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const path = require('path');

module.exports = (config) => {
  config.plugins.push(
    new WebpackBuildNotifierPlugin({
      title: 'Eureka Project',
      activateTerminalOnError: true,
    })
  );

  config.module.rules.push({
    test: /\.scss$/,
    use: [
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            './src/scss/_configuration.scss',
          ],
        },
      },
    ],
  });

  return config;
};
