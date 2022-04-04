export const formatSidebarItemConfig = ({
  name,
  version,
}: ManifestModel): PluginCompileConfigModel => ({
  name,
  entry: {
    'sidebar-item': './src/main',
  },
  classPrefix: 'name',
  version,
  output: '',
});
