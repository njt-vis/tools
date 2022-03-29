import * as fs from 'fs';

import copy from 'recursive-copy';
import logger from './utils/logger';

import { getBuilderConfig } from './engine-config';

export function cleanBundleCache(
  mode: EnvMode
): Promise<NodeJS.ErrnoException | null> {
  return new Promise(resolve => {
    const { output } = getBuilderConfig(mode);
    fs.rm(output, { recursive: true, force: true }, resolve);
  });
}

export async function copyToBundleFolder(
  mode: EnvMode,
  folder: string
): Promise<void> {
  try {
    const results = await copy(folder, getBuilderConfig(mode).output);
    logger.info(`Copied ${results.length} files`);
  } catch (error) {
    logger.error(`Copy failed: ${error}`);
  }
}
