#!/usr/bin/env node

var path     = require('path'),
    fs       = require('fs'),
    flatiron = require('flatiron'),
    app      = flatiron.app,
    common   = require('./lib/common'),
    virsh    = require('./lib/virsh-client');

// add config sources. 'env' and 'argv' are auto-loaded
app.config.use('global', { type: 'file', file: './config/config.json' });
app.config.use('user', { type: 'file', file: './config/user.json' });
app.config.defaults({ 'name': "wirt" });

// use cli {app}
app.use(flatiron.plugins.cli, {
  dir: __dirname,
  usage: [
    'This is ' + app.config.get('name') + '!',
    '',
    'Commands:',
    '  create   - creates a machine',
    '  status   - status of a machine',
    '  start    - starts a machine',
    '  stop     - stop a machine (ACPI)',
    '  kill     - immediately kill a machine'
  ],
  argv: {
    'machine': {
      alias: 'vm',
      description: 'name of a machine.',
      string: true,
      default: app.config.get('machine')
    },
    'host': {
      description: 'target host.',
      string: true,
      default: app.config.get('host')
    }
    }
});

// init {app}
app.init();

// use own modules: `api`, `common`
app.use(common, { "options": false } );
app.use(virsh, { "options": false } );


// CONFIGURE COMMANDS
['create','status','start','stop','kill'].forEach(function(c) {
  app.cmd(c, app.api[c]);
});


// START
app.start();  

// app.log.log('info', "var", {'foo': app.config.get('foo')});
