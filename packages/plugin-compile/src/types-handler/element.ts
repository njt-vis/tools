export const formatElementConfig = ({
  name,
  version,
}: ApplicationModel): Omit<PluginCompileConfigModel, 'mode'> => ({
  name,
  entry: {
    attrbar: 'src/option-panel/index.ts',
    player: 'src/player/index.ts',
  },
  classPrefix: 'name',
  version,
  output: '',
});
