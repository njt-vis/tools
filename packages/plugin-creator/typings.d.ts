declare type CommandOptions = {
  /** 调式启动端口 */
  port?: string;
  /** create 指令下载模板目录 */
  folder?: string;
  /** 是否使用热更 */
  hot?: boolean;
};

/** 插件存储模型 */
declare interface PluginStoreModel {
  /** 启动端口 */
  port: number;
  /** 插件所在目录 */
  path: string;
  /** 是否热更 */
  hot: boolean;
}

declare interface SettingStoreModel {
  version: string;
  plugins: PluginStoreModel[];
}
