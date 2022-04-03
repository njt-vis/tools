import path from 'path';
import {
  compile,
  copyFileToBundle,
  cleanBundleCache,
} from '@njt-vis-tools/plugin-compile';

export async function buildForEnv(
  mode: 'development' | 'production'
): Promise<null> {
  try {
    await cleanBundleCache(mode);
    await compile({ mode });
    copyFileToBundle(mode, path.resolve(), 'application.json');
    return null;
  } catch (error) {
    throw new Error(String(error));
  }
}
