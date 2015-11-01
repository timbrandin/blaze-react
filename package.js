Package.describe({
  name: 'timbrandin:sideburns',
  version: '0.2.4',
  // Brief, one-line summary of the package.
  summary: 'React templates for Meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/timbrandin/meteor-react-sideburns',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

// Package.registerBuildPlugin({
//   name: 'sideburns',
//   use: [
//     'babel-compiler@5.8.24_1',
//     'ecmascript@0.1.6',
//     'underscore@1.0.4',
//     'reactive-var@1.0.6',
//     'tracker@1.0.9',
//     'timbrandin:react-templates'
//   ],
//   sources: [
//     'plugin/plugin.js'
//   ]
//   // npmDependencies: {
//   //   'cheerio': '0.7.0',
//   //   'eval': '0.1.0'
//   // }
// });

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');
  api.use([
    'jsx@0.1.6',
    'ecmascript@0.1.6',
    // 'isobuild:compiler-plugin@1.0.0',
    // 'babel-compiler',
    'timbrandin:react-templates'
  ]);
  api.imply([
    'ecmascript@0.1.6',
    // 'babel-runtime@0.1.4',
    // 'ecmascript-runtime',
    // 'promise',
    'timbrandin:react-templates'
  ]);

  api.addFiles([
    'exports.jsx',
    'sideburns.jsx'
  ]);

  api.export('Template');
});
