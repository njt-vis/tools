import { resolve } from 'path';

const builderConfig: { [k in EnvMode]: BuilderConfigModel } = {
  development: {
    output: resolve('public'),
  },
  production: {
    output: resolve('bundle'),
  },
};

export const getBuilderConfig = (mode: EnvMode): BuilderConfigModel =>
  builderConfig[mode];
