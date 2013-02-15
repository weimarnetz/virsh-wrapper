// `exports.attach` gets called by broadway on `app.use`
exports.attach = function (options) {
  
  var app = this;
  app.common = {};
  
  // # METHODS /////////////////////////////////////////
  // - check for missing config values
  // - usage: app.common.checkConf(['stuff']);
  app.common.checkConf = function (specialNeeds) {
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
        app.log.error('haz no --' + setting + ' :(');
      }
    });
    // return result of check to caller
    if (ok) {
      return ok; // should be 'true', is 'false' on err      
    } else {
      app.log.error("can't do anything.");
      process.exit(1);
    }
  };
  
  app.common.bail = function () {
    app.log.error("not implemented ((o_O))");
  }
  
};

// `exports.init` gets called by broadway on `app.init`.
exports.init = function (done) {

  // This plugin doesn't require any initialization step.
  return done();

};