import * as fs from 'fs';
import * as path from 'path';

import { getApplication } from '@njt-vis-tools/plugin-compile';

import logger from '../../../utils/logger';
import { buildForEnv } from '../../../utils/build';
import { IO_EVENTS } from '../socket/events';
import { getPluginStoreByPath } from '../../../utils/common';

let timer: NodeJS.Timeout | null = null;

async function hotBuild(io: any) {
  const application = getApplication();

  try {
    io.emit('broadcast', {
      name: IO_EVENTS.HOT_BUILDING,
      application,
    });
    await buildForEnv({ mode: 'development' });
    io.emit('broadcast', {
      name: IO_EVENTS.HOT_BUNDLE_SUCCESS,
      application,
    });
  } catch (error) {
    logger.error(error as Error);
    io.emit(IO_EVENTS.HOT_BUNDLE_FAILED, application);
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function hotUpdate(io: any): void {
  logger.info('Listen . . .');
  const root = path.resolve('src');

  fs.watch(root, () => {
    if (!getPluginStoreByPath(path.resolve())?.hot) return;

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      hotBuild(io);
    }, 200);
  });
}
