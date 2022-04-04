import * as os from 'os';
import * as path from 'path';

export const API_PREFIX = '/plugin_creator/api';

export const REPOSITORY_INFO = {
  origin: 'https://gitlab.com',
  prefix: '/api/v4',
  id: 34921654,

  repository: 'direct:https://gitlab.com/n3799/plugin-template.git',
};

/** 配置目录 */
export const settingFolder = path.join(os.homedir(), '.vis-plugin-creator');

/** 各项目配置 */
export const settingFilePath = path.join(settingFolder, 'setting.yml');
