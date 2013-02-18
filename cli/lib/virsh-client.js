// #### virsh api client (broadway plugin)

// # Modules
var path = require('path'),
    fs   = require('fs');

// `exports.attach` gets called by broadway on `app.use`
exports.attach = function (options) {
  
  // 'this' is the app
  var app       = this,
      basepath  = path.join(
        app.config.get('HOME'),
        app.config.get('dir')),
      prefix    = app.config.get('prefix'),
  
  
  // # Functions (private) ###########################
  
  service = {
    'opt': { 'chmod': "755" },
    
    'create': function (srv, callback) {
      srv = srv || app.config.get('machine');
      if (app.common.checkConf(['machine'])) {
        
        app.log.info("creating machine: " + srv);
        
        // create service resource (folder)
        fs.mkdir(service.path(srv), service.opt.chmod, function(err) {
          if (err) {
            callback(err);
          } else { 
            app.log.info("ok!", { "machine": srv, "action": "create" });
            callback(null);
          }
        });
        
      }
    },
    
    'command': function (srv, cmd, callback) {
      srv = srv || app.config.get('machine');
      if (app.common.checkConf(['machine'])) {
        app.log.info("writing command: " + cmd);
        
        // write command as file with same name to service folder
        fs.writeFile(path.join(service.path(srv), cmd), "", function(err) {
          if (err) {
            callback(err);
          } else {
            app.log.info("ok!", { "machine": srv, "command": cmd} );
            callback();
          }
        });
      }
    },
    
    'path': function (srv) {
      return path.join(basepath, prefix + srv);
    }
  };

  // # Methods (public) ##############################
  // for now everything is hard-coded to 'vm'/'dom'.
  
  app.api = {
  
    'create': function (machine) {
      service.create(machine, function(err) {
        if (err) {
          app.log.error(err);
        }
      });
    },
    
    'status': function (machine) {
      app.common.bail(); // TODO: how?
    },
    
    'start': function (machine) {
      service.command(machine, 'start', function(err) {
        if (err) {
          app.log.error(err);
        }
      });
    },
    
    'stop': function (machine) {
      service.command(machine, 'stop', function(err) {
        if (err) {
          app.log.error(err);
        }
      });
    },
    
    'kill': function (machine) {
      service.command(machine, 'destroy', function(err) {
        if (err) {
          app.log.error(err);
        }
      });
    }
  
  };
  
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {

  // Everything is already done in 'attach'.
  return done();

};