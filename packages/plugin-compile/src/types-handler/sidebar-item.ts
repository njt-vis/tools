export const formatSidebarItemConfig = ({
  name,
  version,
}: PluginManifestModel): PluginCompileConfigModel => ({
  name,
  entry: {
    'sidebar-item': './src/main.ts',
  },
  classPrefix: 'name',
  version,
  output: '',
});
