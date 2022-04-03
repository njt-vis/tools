import { resolve } from 'path';

import {
  compile,
  cleanBundleCache,
  copyFileToBundle,
  copyFolderToBundle,
} from '@njt-vis-tools/plugin-compile';

import logger from '../../utils/logger';

async function execBuild(_options: CommandOptions): Promise<any> {
  logger.info('Start build: ');
  console.log('\n');

  const mode = 'production';

  await cleanBundleCache(mode);

  await copyFolderToBundle(mode, resolve('static'));

  copyFileToBundle(mode, resolve(), 'application.json');

  await compile({ mode });

  console.log('\n');
  logger.info('All build.');
}

export default execBuild;
