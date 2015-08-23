// access to user business layer and controller
var db = require('../models/dal/DBContextChoser').AppUser;

// access to user entity
var userModel = require('../models/entities/AppUser');

// passport module configuration
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


// passport strategy and serialize/deserialize functions
passport.use(new LocalStrategy(function(username, password, done)  {
    db.find(function(item){
      
      return item.Username == username;
      
      },function (err, user) {
        if (err)
          done(err, null);

        user = user || userModel.Empty();

        if(!user.Password || !user.ValidatePassword(password)){
          return done(null, false, {error: "Invalid Username or Password."});
        } else {
          return done(null,user);
        }
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.Username);
});

passport.deserializeUser(function(username, done) {
  db.find(function(item){
      return item.Username == username;
    }, function (err, user) {
        if (err)
            return done(err, null);
        done(null, user);
    });
});

// function to control page access to authenticated users only...
var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login?redirect='+req.url);
}

var apiAuthentication = function(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }

    return res.status(401).send('Unauthorized');

}

var router = require('express').Router();

//restrict access to certain paths
router.all('/api*', apiAuthentication);
router.all('/session*', ensureAuthenticated);
  
// routes for login/logout
router.get('/login', function (req, res, next) {
  res.locals.redirect = req.query.redirect;
  if(req.query.loginErr){
    res.locals.errorModalMessage='Invalid username or password';
    res.locals.errorModalTitle='Error';
  }
  return res.render('Users/login');
});

router.post('/login',function(req,res,next){
    passport.authenticate('local', function(err, user, info) {
      var redirect = req.body.redirect == '' ? '/' : req.body.redirect;
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login?loginErr=1&redirect=' + redirect); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect(redirect);
      });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;