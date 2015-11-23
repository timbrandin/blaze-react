Package.describe({
  name: 'timbrandin:blaze-react',
  version: '0.4.0',
  summary: 'React templates for Meteor',
  git: 'https://github.com/timbrandin/blaze-react',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'blaze-react',
  use: [
    'ecmascript@0.1.6',
    'babel-compiler@5.8.24_1',
    'underscore@1.0.4',
    'reactive-var@1.0.6',
    'tracker@1.0.9'
  ],
  sources: [
    'lib/template-regex.js',
    'lib/react-regex.js',
    'plugin/plugin.js'
  ]
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');

  api.use([
    'ecmascript@0.1.6',
    'underscore@1.0.4',
    'isobuild:compiler-plugin@1.0.0',
    'react-runtime@0.14.1_1',
    'jsx@0.1.6',
    'check',
    'minimongo'
  ]);
  api.imply([
    'ecmascript@0.1.6',
    'babel-runtime@0.1.4',
    'react-runtime@0.14.1_1',
    'kadira:dochead@1.3.2',
    'timbrandin:safestring@0.0.1',
    'timbrandin:classnames@0.0.1'
  ]);

  api.use('kadira:flow-router-ssr@3.5.0', ['client', 'server'], {weak: true});

  api.addFiles([
    'lib/blaze-react.jsx',
    'lib/create-from-blaze.js'
  ]);

  api.export(['ReactTemplate', 'Template']);
});
