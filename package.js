Package.describe({
  name: 'timbrandin:sideburns',
  version: '0.3.1',
  // Brief, one-line summary of the package.
  summary: 'React templates for Meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/timbrandin/meteor-react-sideburns',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');
  api.use([
    'jsx@0.1.6',
    'timbrandin:react-templates@0.0.3',
    'check',
    'minimongo'
  ]);
  api.imply([
    'timbrandin:react-templates@0.0.3'
  ]);

  api.use('kadira:flow-router-ssr@3.5.0', ['client', 'server'], {weak: true});

  api.addFiles([
    'template.jsx'
  ]);

  api.export('Template');
});
