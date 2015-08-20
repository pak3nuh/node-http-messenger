// access to user business layer and controller
var db = require('../models/dal/DBContextMemory').AppUser;

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

    res.redirect('/login');
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
router.get('/login', function (req, res) {
  return res.render('Users/login');
});

router.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login'}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;