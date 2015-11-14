Package.describe({
  name: 'timbrandin:blaze-react',
  version: '1.0.0',
  summary: 'React templates for Meteor',
  git: 'https://github.com/timbrandin/blaze-react',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'blaze-react',
  use: [
    'babel-compiler@5.8.24_1',
    'ecmascript@0.1.6',
    'babel-compiler@5.8.24_1',
    'underscore@1.0.4',
    'reactive-var@1.0.6',
    'tracker@1.0.9'
  ],
  sources: [
    'events-regex.js',
    'plugin/events.js',

    'template-regex.js',
    'react-regex.js',
    'react-events.js',
    'plugin/template.js'
  ],
  npmDependencies: {
    'cheerio': '0.7.0'
  }
});

Npm.depends({
  "classnames": "2.1.3"
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');

  api.use([
    'isobuild:compiler-plugin@1.0.0',
    'babel-compiler',
    'react-runtime@0.14.1_1'
  ]);
  api.imply([
    'babel-runtime@0.1.4',
    'ecmascript-runtime',
    'promise',
    'react-runtime@0.14.1_1',
    'kadira:dochead@1.3.2'
  ]);

  api.use([
    'jsx@0.1.6',
    'check',
    'minimongo'
  ]);

  api.use(['cosmos:browserify@0.8.3'], 'client');

  api.use('kadira:flow-router-ssr@3.5.0', ['client', 'server'], {weak: true});

  api.addFiles([
    'exports-server.js',
    'exports.js',
  ], 'server');

  api.addFiles([
    'client.browserify.js',
    'exports.js'
  ], 'client');

  api.addFiles([
    'template.jsx'
  ]);

  api.export(['RT', 'ReactTemplate', 'Template']);
});
