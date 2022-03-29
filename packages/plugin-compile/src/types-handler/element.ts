export const formatElementConfig = ({
  name,
  version,
}: PluginManifestModel): PluginCompileConfigModel => ({
  name,
  entry: {
    attrbar: 'src/option-panel/index.ts',
    player: 'src/player/index.ts',
  },
  classPrefix: 'name',
  version,
  output: '',
});
