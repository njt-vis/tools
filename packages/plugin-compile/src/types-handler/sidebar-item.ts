export const formatSidebarItemConfig = ({
  name,
  version,
}: PluginManifestModel): PluginCompileConfigModel => ({
  name,
  entry: {
    'sidebar-item': './src/main',
  },
  classPrefix: 'name',
  version,
  output: '',
});
