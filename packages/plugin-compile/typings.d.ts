declare type EnvMode = 'development' | 'production';

declare type PluginType = 'SIDEBAR_ITEM' | 'ELEMENT';

declare interface PluginManifestModel {
  name: string;
  icon: string;
  displayName: string;
  description: string;
  type: PluginType;
  version: string;
  engines: {
    vis: string;
  };
}

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
