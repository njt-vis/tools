export const formatElementConfig = ({
  name,
  version,
}: ManifestModel): PluginCompileConfigModel => ({
  name,
  entry: {
    attrbar: 'src/option-panel/index.ts',
    player: 'src/player/index.ts',
  },
  classPrefix: 'name',
  version,
  output: '',
});
