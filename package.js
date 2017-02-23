Package.describe({
  name: 'color:turatel',
  version: '0.0.1',
  summary: 'Turatel Sms Message Services',
  git: 'https://github.com/coloryazilim/turatel.git',
  documentation: 'README.md'
});

Npm.depends({
  "request": "2.74.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.3');
  api.use(['ecmascript', 'underscore']);
  api.mainModule('turatel.js', 'server');
});
