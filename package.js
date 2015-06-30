Package.describe({
  name: 'timbrandin:jsx-templating',
  version: '0.1.2',
  // Brief, one-line summary of the package.
  summary: 'React jsx templating',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/timbrandin/meteor-react-jsx-templating',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'transpileJSXHTML',
  use: ['babel-compiler@5.4.7'],
  sources: [
    'jsx-templating-plugin.js'
  ]
});

Package.onUse(function (api) {
  // We need the Babel helpers as a run-time dependency of the generated code.
  api.imply('babel-runtime@0.1.0');
  api.imply('react-meteor-data@0.1.0');
});
