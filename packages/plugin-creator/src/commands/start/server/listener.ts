import * as fs from 'fs';
import * as path from 'path';

import { getApplication } from '@njt-vis-tools/plugin-compile';

import logger from '../../../utils/logger';
import { buildForEnv } from '../../../utils/build';
import { IO_EVENTS } from '../socket/events';

let timer: NodeJS.Timeout | null = null;

async function hotBuild(io: any) {
  const application = getApplication();

  try {
    await buildForEnv('development');
    io.emit(IO_EVENTS.HOT_BUNDLE_SUCCESS, application);
  } catch (error) {
    logger.error(error as Error);
    io.emit(IO_EVENTS.HOT_BUNDLE_FAILED, application);
  }
}

export function hotUpdate(io: any): void {
  const root = path.resolve('src');
  fs.watch(root, () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      hotBuild(io);
    }, 200);
  });
}
