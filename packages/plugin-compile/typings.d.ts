declare interface PluginCompileConfigModel {
  name: string;
  classPrefix: string;
  version: string;
  output: string;
  entry: Record<string, string>;
}

declare type BuilderConfigModel = {
  output: string;
};
