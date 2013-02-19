var prompt = require('prompt');

// `exports.attach` gets called by broadway on `app.use`
exports.attach = function (options) {
  
  var app = this;
  app.common = {};
  
  // # METHODS /////////////////////////////////////////
  // - check for missing config values
  // - usage: app.common.checkConf(['stuff'], callback);
  app.common.checkConf = function (specialNeeds, callback) {
    var conf  = app.config.get(),
        needs = ['host','user','dir','prefix'], // the default needs
        callback = callback;
        ok    = true; // be optimistic
  
    // default needs are combined with the needs of the caller, if any
    if (specialNeeds) {
      needs = needs.concat(specialNeeds);
    }
    
    // loop over all th eneeded values
    needs.forEach(function (setting) {
      
      // check if we have a value for setting we want
      if (!conf[setting]) {   
        app.log.error('haz no --' + setting + ' :(');
        
        // TODO: even nicer prompt, read user reasources… <https://github.com/weimarnetz/virsh-wrapper/issues/3>

        // be nice and prompt the user for the missing info
        app.common.prompt(setting, function (err, value) {
          if (err) {
            // something went wrong while prompting
            ok = err;
          } else {
            // use the new value for setting
            app.config.set(setting, value);
          }
          callback(ok);
        });
      }
    });
    
    // post-loop, return result of check to caller
    // callback(ok);
    // app.log.error("can't do anything.");
    // process.exit(1);          
  };
  
  app.common.prompt = function (property, callback) {
    var prop = property;
    
    // TODO: input validation
    // var validate = { pattern: /^[a-zA-Z\s\-]+$/, message: 'only letters, spaces, or dashes', required: true },
    //     schema = {};
    // schema.properties[setting] = validate;
        
    prompt.get(prop, function (err, result) {
      if (err) {
        // if there was an error, bubble it up
        callback(err);
      } else {
        // if no error, callback with the result value
        callback(null, result[prop]);
      }
    });
  };
  
  app.common.bail = function () {
    app.log.error("not implemented ((o_O))");
  };
  
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {

  // This plugin doesn't require any initialization step.
  return done();

};