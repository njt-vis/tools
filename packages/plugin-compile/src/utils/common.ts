import * as fs from 'fs';
import { resolve } from 'path';
import logger from './logger';

const applicationFile = 'application.json';

export const readApplicationFile = (): ApplicationModel | void => {
  let pluginManifest;

  try {
    pluginManifest = JSON.parse(
      fs.readFileSync(resolve(applicationFile), 'utf8')
    );
  } catch (err) {
    logger.warn(`Lost ${err}`);
  }

  return pluginManifest;
};

export function compose(...fns) {
  return fns.reduce((prev, next) => args => next(prev(args)));
}
