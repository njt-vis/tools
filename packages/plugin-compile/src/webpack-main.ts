const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const ColoredProgressBar = require('colored-progress-bar-webpack-plugin');

const cssRegex = /\.(css)$/;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const formatWebpackConfig = (config: PluginCompileConfigModel) => ({
  mode: 'production',
  entry: config.entry,
  output: {
    filename: '[name].js',
    path: config.output,
    libraryTarget: 'system',
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new SimpleProgressWebpackPlugin(),
    new ColoredProgressBar(),
  ],
  performance: {
    maxEntrypointSize: 2000000,
    maxAssetSize: 2000000,
  },
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          compact: false,
        },
      },
      {
        test: /\.ts?$/,
        use: [require.resolve('babel-loader'), require.resolve('ts-loader')],
      },
      {
        test: cssRegex,
        sideEffects: true,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve('css-loader'),
            options: {
              esModule: true,
              importLoaders: 1,
              modules: {
                mode: 'local',
                localIdentName: `${config.classPrefix}_[local]`,
              },
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
        ],
      },
    ],
  },
});
