declare interface PluginCompileConfigModel {
  mode: EnvMode;
  name: string;
  classPrefix: string;
  version: string;
  output: string;
  entry: Record<string, string>;
  publicPath?: string;
}

declare type BuilderConfigModel = {
  output: string;
};
