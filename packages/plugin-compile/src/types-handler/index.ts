import { resolve } from 'path';
import logger from '../utils/logger';
import { compose, readApplicationFile } from '../utils/common';
import { formatSidebarItemConfig } from './sidebar-item';
import { formatElementConfig } from './element';
import { getBuilderConfig } from '../engine-config';

const handlerMaps = new Map<
  PluginType,
  (manifest: ApplicationModel) => Omit<PluginCompileConfigModel, 'mode'>
>();

handlerMaps.set('SIDEBAR_ITEM', formatSidebarItemConfig);
handlerMaps.set('ELEMENT', formatElementConfig);

const handleClassPrefix = (
  config: PluginCompileConfigModel
): PluginCompileConfigModel => {
  const classPrefix = `${config.name}_${config.version}`.replace(
    /[^\d^\w]/g,
    '_'
  );
  return {
    ...config,
    classPrefix,
  };
};

const handle = (
  manifest: ApplicationModel
): Omit<PluginCompileConfigModel, 'mode'> | undefined => {
  const handleByPluginType = handlerMaps.get(manifest.type);

  if (!handleByPluginType) return undefined;

  const config = compose(handleByPluginType, handleClassPrefix)(manifest);

  return config;
};

/**
 * 获取编译配置
 * @param {EnvMode} options.mode - 编译环境
 * @return {PluginCompileConfigModel | undefined} - 编译配置信息
 */
export const handlePluginCompileConfig = ({
  mode,
  publicPath,
}: {
  mode: EnvMode;
  publicPath?: string;
}): PluginCompileConfigModel | string => {
  const application = readApplicationFile();

  if (!application) return 'Lost file application.json';

  const config: Omit<PluginCompileConfigModel, 'mode'> | undefined =
    handle(application);

  if (!config) {
    return `No plugin type like ${application.type}`;
  }

  const { output } = getBuilderConfig(mode);
  logger.info(output);
  return { ...config, mode, publicPath, output: resolve(output) };
};
