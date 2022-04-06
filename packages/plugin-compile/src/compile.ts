import { existsSync } from 'fs';
import { resolve } from 'path';
import webpack from 'webpack';

import { formatWebpackConfig } from './webpack-main';
import logger from './utils/logger';
import { handlePluginCompileConfig } from './types-handler';

const systemjsInterop = require('systemjs-webpack-interop/webpack-config');
const { merge } = require('webpack-merge');

const createWebpackConfig = (...configs) => {
  const webpackConfig = merge(...configs);

  return systemjsInterop.modifyWebpackConfig(webpackConfig);
};

const getCustomWebpackConfig = () => {
  const customConfigPath = resolve('webpack.config.merge.js');
  const config = {};
  if (existsSync(customConfigPath)) {
    const webpackConfigCustom = require(customConfigPath);
    Object.assign(config, webpackConfigCustom);
  }
  return config;
};

function build(options: PluginCompileConfigModel): Promise<string> {
  return new Promise((resolve, reject) => {
    const webpackConfig = createWebpackConfig(
      getCustomWebpackConfig(),
      formatWebpackConfig(options)
    );

    const compiler = webpack(webpackConfig);

    compiler.run((error, stats) => {
      if (error) {
        // let errMessage = error.message;
        reject(error);
        return;
      }
      if (stats?.hasErrors()) {
        reject(stats?.toString({ all: false, warnings: false, errors: true }));
        return;
      }
      resolve('complete');

      // console.log(stats.toString({
      //   chunks: false, // 使构建过程更静默无输出
      //   colors: true // 在控制台展示颜色
      // }));

      // compiler.close((closeError) => {
      //   if (closeError) {
      //     console.log(closeErr);
      //   }
      // });
    });
  });
}

export const compile = ({
  mode,
  publicPath,
}: {
  mode: EnvMode;
  publicPath?: string;
}): Promise<string> => {
  const compileConfig: PluginCompileConfigModel | string =
    handlePluginCompileConfig({ mode, publicPath });

  return new Promise((resolve, reject) => {
    if (typeof compileConfig === 'string') {
      logger.error(compileConfig);
      reject(compileConfig);
      return;
    }

    build(compileConfig)
      .then(message => {
        resolve(message);
      })
      .catch(error => {
        console.log(error);
        logger.error(error);
      });
  });
};
