declare type EnvMode = 'development' | 'production';

declare type PluginType = 'SIDEBAR_ITEM' | 'ELEMENT';

declare interface ManifestModel {
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
