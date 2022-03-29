import { resolve } from 'path';

import {
  compile,
  cleanBundleCache,
  copyToBundleFolder,
} from '@njt-vis-tools/plugin-compile';

import logger from '../../utils/logger';

async function execBuild(_options: CommandOptions): Promise<any> {
  logger.info('Start build: ');
  console.log('\n');

  const mode = 'production';

  cleanBundleCache(mode);

  await copyToBundleFolder(mode, resolve('static'));

  await compile({ mode });

  console.log('\n');
  logger.info('All build.');
}

export default execBuild;
