var flatiron = require('flatiron'),
    path     = require('path'),
    fs       = require('fs'),
    app      = flatiron.app;

// init {app}
app.init();

// add config sources. 'env' and 'argv' are auto-loaded
app.config.use('global', { type: 'file', file: './config/config.json' });
app.config.use('user', { type: 'file', file: './config/user.json' });

// init cli {app}
app.use(flatiron.plugins.cli, {
  dir: __dirname,
  usage: [
    'This is ' + app.config.get('name') + '!',
    '',
    'Commands:',
    '  create - creates a machine'
  ],
  argv: {
      machine: {
        alias: 'm',
        description: 'name of a machine.',
        string: true,
        default: app.config.get('default-machine')
      },
    }
});


// CHECK for config values
var checkConf = function (specialNeeds) {
  var conf  = app.config.get(),
      needs = ['host','user','dir','prefix'], // the default needs
      ok    = true; // be optimistic
  
  // default needs are combined with the needs of the caller, if any
  if (specialNeeds) {
    needs = needs.concat(specialNeeds);
  }
  
  // check if we have a value for setting we need
  needs.forEach( function (setting) {
    if (!conf[setting]) {
      ok = false;
      app.log.error('plz specify \'' + setting + '\'');
    }
  });
  // return result of check to caller
  return ok; // should be 'true', is 'false' on err
};


// very simple fake module
// the API is file-based
// hoard functions here while developing
app.api = (function() {
  var basepath = path.join(
        app.config.get('HOME'),
        app.config.get('dir'),
        app.config.get('prefix'));
  
  return { // return object with our api methods
    
    'start': function (machine) {      
      app.config.set('machine', machine);
      
      if (checkConf(['machine'])) {
        app.log.info("Creating vm: " + machine);
        console.log(basepath + machine);
         
        fs.writeFile(basepath + machine, "", function(err) {
          if (err) { throw err; }
          app.log.notice("started: " + machine.nick);
        });
      } else {
        app.log.log('error', "missing info");
        process.exit(1);
      }
    }
  };
}());

// CONFIGURE COMMANDS

app.cmd('create', app.api.start);
app.cmd(':machine create', app.api.start);
app.cmd('x :machine', app.api.start);

app.cmd('test', function (a) {
  console.log("argument: " + JSON.stringify(a));
});
// You will need to dispatch the cli arguments yourself
// app.router.dispatch('on', process.argv.slice(2).join(' '));
 

// START
app.start();
app.log.log('debug', "started", {'ok': app.config.get('ok')});
app.log.log('info', "foo", app.config.get('foo'));
