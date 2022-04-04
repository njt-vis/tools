import { statSync, readFileSync, writeFileSync } from 'fs';
import * as net from 'net';
import * as path from 'path';

import axios from 'axios';
import logger from './logger';
import * as setting from '../setting';
import { API_PREFIX } from '../setting';

const YAML = require('yaml');

interface PluginStoreCreateProps {
  hot: boolean;
  port: number;
}

const call = (obj: any): string => Object.prototype.toString.call(obj);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isPromise = (obj: any): boolean =>
  call(obj) === '[object Promise]';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isFunction = (obj: any): boolean =>
  call(obj) === '[object Function]';

export const isFolder = (name: string): boolean => {
  try {
    const stats = statSync(name);
    return stats.isDirectory();
  } catch (_error) {
    return false;
  }
};

export const isFile = (filePath: string): boolean => {
  try {
    const stats = statSync(filePath);
    return !stats.isDirectory();
  } catch (_error) {
    return false;
  }
};

/** 读取 json 内容文件 */
export const readJsonFile = (filePath: string): any => {
  let result;
  try {
    result = JSON.parse(readFileSync(filePath, { encoding: 'utf8' }));
  } catch (error) {
    logger.error(error as Error);
  }
  return result;
};

export const json2yaml = (json: Record<string, any>): string =>
  YAML.stringify(json);

export const yaml2json = (json: string): Record<string, any> =>
  YAML.parse(json);

/** 检测端口是否被占用 */
export const isPortOccupied = (port: number): Promise<false> =>
  new Promise((resolve, reject) => {
    const server = net.createServer().listen(port);

    server.on('listening', () => {
      server.close(); // 关闭服务
      resolve(false);
    });

    server.on('error', (err: any) => {
      // 端口已经被使用
      if (err.code === 'EADDRINUSE') {
        reject(
          new Error(`The port [${port}] is occupied, please change other port.`)
        );
      } else {
        reject(err);
      }
    });
  });

/** 读取配置文件 */
export const getSettingStore = (): SettingStoreModel =>
  yaml2json(
    readFileSync(setting.settingFilePath, { encoding: 'utf8' })
  ) as SettingStoreModel;

/** 写入配置文件 */
export const writeSettingFile = (settingStore: SettingStoreModel): void => {
  writeFileSync(setting.settingFilePath, json2yaml(settingStore), {
    encoding: 'utf8',
  });
};

/** 读取插件生成器 package.json 文件 */
export const getPackage = (): Record<string, any> =>
  JSON.parse(
    readFileSync(path.join(__dirname, '../../package.json'), {
      encoding: 'utf8',
    })
  );

/** 创建客户端配置文件默认内容 */
export function createPluginStoreContent({
  hot,
  port,
}: PluginStoreCreateProps): PluginStoreModel {
  const pluginInfo = {
    path: path.resolve(),
    hot,
    port,
  };
  return pluginInfo;
}

/** 创建客户端配置文件默认内容 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function addPluginStore(props: PluginStoreCreateProps) {
  const pluginPath = path.resolve();
  const settingStore = getSettingStore();
  const pluginStore = createPluginStoreContent(props);

  const pluginIndex = settingStore.plugins.findIndex(
    plugin => plugin.path === pluginPath
  );

  if (pluginIndex === -1) {
    settingStore.plugins.push(pluginStore);
  } else {
    settingStore.plugins[pluginIndex] = pluginStore;
  }
  writeSettingFile(settingStore);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function isPluginAlive() {
  const pluginStore = getPluginStoreByPath(path.resolve());

  if (!pluginStore) return false;

  try {
    const res = await axios.get(
      `http://localhost:${pluginStore.port}${API_PREFIX}/is_alive`
    );
    return res?.data?.data === 'alive';
  } catch (_error) {
    return false;
  }
}

/** 通过项目路径查找插件存储信息 */
export function getPluginStoreByPath(
  pluginPath: string
): PluginStoreModel | undefined {
  const settingJson = getSettingStore();

  return settingJson.plugins.find(item => item.path === pluginPath);
}
