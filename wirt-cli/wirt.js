#!/usr/bin/env node

var path     = require('path'),
    fs       = require('fs'),
    flatiron = require('flatiron'),
    app      = flatiron.app,
    common   = require('./lib/common'),
    virsh    = require('./lib/virsh-client');

// add config sources. 'env' and 'argv' are auto-loaded

// `/path/to/install/config/config.json`:
app.config.use('global', { type: 'file', file: path.join(__dirname, 'config', 'config.json') });

// `~/.wirt.json`:
app.config.use('user', { type: 'file', file: path.join(__dirname, '.wirt.json') });

// set the default values: name
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

// if we have no 'user' value, get the posix USER
app.config.set('user', app.config.get('user') || app.config.get('USER'));

// CONFIGURE COMMANDS
['create','status','start','stop','kill'].forEach(function(c) {
  app.cmd(c, app.api[c]);
});


// START
app.start();  

// app.log.log('info', "var", {'foo': app.config.get('foo')});
