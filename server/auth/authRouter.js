var passport         = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    request          = require('request-promise'),
    auth             = require('./auth.js');

// Check if we are in deployed state and if not, require the _private-config.json file   
if(process.env.FACEBOOK_APP_ID === undefined && process.env.FACEBOOK_APP_SECRET === undefined){
  var  CONF             = require('../../_private-config.json');
}

module.exports = function (authRouter) {

  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID || CONF.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET || CONF.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback'
    }, function(){/*not used*/}));

  authRouter.get('/facebook', passport.authenticate('facebook'));

  authRouter.get('/facebook/callback', auth.facebookCallbackHandler);

};