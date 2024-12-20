module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.extensionAlias = {
        '.js': ['.js', '.ts']
      };
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '#minpath': require.resolve('vfile/lib/minpath.js')
      };
      return webpackConfig;
    }
  }
};