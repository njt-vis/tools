export const formatSidebarItemConfig = ({
  name,
  version,
}: ApplicationModel): Omit<PluginCompileConfigModel, 'mode'> => ({
  name,
  entry: {
    'sidebar-item': './src/main',
  },
  classPrefix: 'name',
  version,
  output: '',
});
