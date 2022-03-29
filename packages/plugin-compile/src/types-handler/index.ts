import { resolve } from 'path';
import logger from '../utils/logger';
import { compose, readApplicationFile } from '../utils/common';
import { formatSidebarItemConfig } from './sidebar-item';
import { formatElementConfig } from './element';
import { getBuilderConfig } from '../engine-config';

const handlerMaps = new Map<
  PluginType,
  (manifest: PluginManifestModel) => PluginCompileConfigModel
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
  manifest: PluginManifestModel
): PluginCompileConfigModel | undefined => {
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
}: {
  mode: EnvMode;
}): PluginCompileConfigModel | string => {
  const manifestFile = readApplicationFile();

  if (!manifestFile) return 'Lost file application.json';

  const config = handle(manifestFile);

  if (!config) {
    return `No plugin type like ${manifestFile.type}`;
  }

  if (config) {
    const { output } = getBuilderConfig(mode);
    logger.info(output);
    Object.assign(config, { output: resolve(output) });
  }

  return config;
};
