Package.describe({
  name: 'timbrandin:sideburns',
  version: '0.2.2',
  // Brief, one-line summary of the package.
  summary: 'React templates for Meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/timbrandin/meteor-react-sideburns',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'transpileJSXHTML',
  use: [
    'underscore@1.0.3',
    'babel-compiler@5.4.7',
    'cosmos:browserify@0.4.0',
  ],
  sources: [
    'react-events.js',
    'sideburns.js'
  ],
  npmDependencies: {
    'cheerio': '0.7.0',
    'eval': '0.1.0'
  }
});

Npm.depends({
  "classnames": "2.1.3"
});

Package.onUse(function (api) {
  // We need the Babel helpers as a run-time dependency of the generated code.
  api.imply('babel-runtime@0.1.0');
  api.imply('react-meteor-data@0.1.0');
  api.use(['cosmos:browserify@0.4.0'], 'client');

  api.addFiles([
    'classnames-server.js',
    'sideburns-export.js'
  ], 'server');

  api.addFiles([
    'client.browserify.js',
    'sideburns-export.js'
  ], 'client');

  api.export('Sideburns');
});
