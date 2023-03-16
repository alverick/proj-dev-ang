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
            path.resolve(
              __dirname,
              '../node_modules/include-media/dist/_include-media.scss'
            ),
          ],
        },
      },
    ],
  });

  return config;
};
