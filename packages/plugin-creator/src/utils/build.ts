import path from 'path';

import {
  compile,
  copyFileToBundle,
  copyFolderToBundle,
  cleanBundleCache,
} from '@njt-vis-tools/plugin-compile';

interface BuildForEnvProps {
  mode: 'development' | 'production';
}

export async function buildForEnv(props: BuildForEnvProps): Promise<null> {
  const { mode } = props;
  try {
    await cleanBundleCache(mode);
    await compile({ mode });
    await copyFolderToBundle(mode, path.resolve('static'));
    await copyFileToBundle(mode, path.resolve(), 'application.json');
    return null;
  } catch (error) {
    throw new Error(String(error));
  }
}
