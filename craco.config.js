const path = require('path');
module.exports = {
  eslint: {
    enable: process.env.NODE_ENV !== 'production'
  },
  webpack: {
    configure: webpackConfig => {
      return {
        ...webpackConfig,
        entry: {
          main: {import: webpackConfig.entry},
          plugin: {
            import: path.resolve(__dirname, './src/AnimationTool.js'),
            filename: 'dist/' + process.env.PLUGIN_FILE_NAME,
            library: {
              name: process.env.GLOBAL_PLUGIN_VAR_NAME || 'AnimationTool',
              type: 'umd',
              umdNamedDefine: true,
              export: 'default'
            }
          }
        },
        plugins: adjustPlugins(webpackConfig)
      };
    }
  }
};

function adjustPlugins(config) {
  const defaultEntryHTMLPlugin = config.plugins.filter(plugin => {
    return plugin.constructor.name === 'HtmlWebpackPlugin';
  })[0];
  defaultEntryHTMLPlugin.userOptions.chunks = ['main'];

  return [
    ...config.plugins.filter(plugin => {
      return plugin.constructor.name !== 'HtmlWebpackPlugin';
    }),
    defaultEntryHTMLPlugin
  ];
}

// const rewireEntries = [
//   {
//     name: 'plugin',
//     entry: path.resolve(__dirname, './src/AnimationTool.js'),
//     template: path.resolve(__dirname, './public/index.html'),
//     filename: 'integration-demo.html'
//   }
// ];
//
// const defaultEntryName = 'main';
//
// const appIndexes = ['js', 'tsx', 'ts', 'jsx'].map(ext =>
//   path.resolve(__dirname, `src/index.${ext}`)
// );
//
// function webpackMultipleEntries(config) {
//   // Multiple Entry JS
//   const defaultEntryHTMLPlugin = config.plugins.filter(plugin => {
//     return plugin.constructor.name === 'HtmlWebpackPlugin';
//   })[0];
//
//   defaultEntryHTMLPlugin.options = defaultEntryHTMLPlugin.options || {};
//   defaultEntryHTMLPlugin.options.chunks = [defaultEntryName];
//
//   console.log(config);
//   console.log(config.entry);
//
//   // config.entry is not an array in Create React App 4
//   if (!Array.isArray(config.entry)) {
//     config.entry = [config.entry];
//   }
//
//   // If there is only one entry file then it should not be necessary for the rest of the entries
//   const necessaryEntry =
//     config.entry.length === 1
//       ? []
//       : config.entry.filter(file => !appIndexes.includes(file));
//   const multipleEntry = {};
//   multipleEntry[defaultEntryName] = config.entry;
//
//   rewireEntries.forEach(entry => {
//     multipleEntry[entry.name] = necessaryEntry.concat(entry.entry);
//     // Multiple Entry HTML Plugin
//     config.plugins.unshift(
//       new defaultEntryHTMLPlugin.constructor(
//         Object.assign({}, defaultEntryHTMLPlugin.options, {
//           filename: entry.filename,
//           template: entry.template,
//           chunks: [entry.name]
//         })
//       )
//     );
//   });
//   config.entry = multipleEntry;
//
//   // Multiple Entry Output File
//   let names = config.output.filename.split('/').reverse();
//
//   if (names[0].indexOf('[name]') === -1) {
//     names[0] = '[name].' + names[0];
//     config.output.filename = names.reverse().join('/');
//   }
//
//   return config;
// }
// module.exports = {
//   webpack: {
//     ...whenProd(() => {
//       return {configure: webpackMultipleEntries};
//     }, {})
//   }
// };
