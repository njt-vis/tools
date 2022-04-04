import { mkdirSync, writeFileSync } from 'fs';

import * as constants from '../setting';
import { flowsCompose } from './flow-exec';
import { isFolder, isFile, getPackage } from './common';

/** 创建默认配置 */
function createDefaultSetting(): SettingStoreModel {
  return {
    version: getPackage().version,
    plugins: [],
  };
}

/** 判断配置目录是否存在 */
function isExistSettingFolder() {
  return isFolder(constants.settingFolder);
}

/** 尝试创建配置目录 */
const tryCreateSettingFolder = () => {
  if (isExistSettingFolder()) return 0;

  return () => {
    mkdirSync(constants.settingFolder, { recursive: true });
  };
};

/** 尝试创建配置文件 */
function tryCreateSetting(name: string, content: string) {
  return () => {
    if (isFile(name)) return 0;

    return () => {
      writeFileSync(name, content, { encoding: 'utf8' });
    };
  };
}

/** 执行指令前, 进行初始化流程 */
export function initialize(
  state: Record<string, any>,
  callback: () => void
): void {
  flowsCompose(state)
    .exec(tryCreateSettingFolder)
    .exec(
      tryCreateSetting(
        constants.settingFilePath,
        JSON.stringify(createDefaultSetting(), null, 2)
      )
    )
    .exec(() => callback);
}
