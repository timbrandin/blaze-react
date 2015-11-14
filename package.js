Package.describe({
  name: 'timbrandin:sideburns',
  version: '0.3.2',
  summary: 'React templates for Meteor',
  git: 'https://github.com/timbrandin/meteor-react-sideburns',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');
  api.use([
    'jsx@0.1.6',
    'timbrandin:react-templates@0.0.4',
    'check',
    'minimongo'
  ]);
  api.imply([
    'timbrandin:react-templates@0.0.4'
  ]);

  api.use('kadira:flow-router-ssr@3.5.0', ['client', 'server'], {weak: true});

  api.addFiles([
    'template.jsx'
  ]);

  api.export('Template');
});
