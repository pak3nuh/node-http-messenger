// access to user business layer and controller
var db = require('../models/dal/DBContextChoser').AppUser;

// access to user entity
var UserModel = require('../models/entities/AppUser');

// passport module configuration
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


// passport strategy and serialize/deserialize functions
passport.use(new LocalStrategy(function(username, password, done)  {
    db.setClosure({username:username, password:password});
    db.find(function(item){
      
      return item.Username == username;
      
      },function (err, user) {
        if (err)
          done(err, null);

        user = user || UserModel.Empty();

        if(!user.Password || user.Password!=password){
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
  db.setClosure({username:username});
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

    res.redirect('/users/login?redirect='+req.url);
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
router.get('/users/login', function (req, res, next) {
  res.locals.redirect = req.query.redirect;
  if(req.query.loginErr){
    res.locals.errorModalMessage='Invalid username or password';
    res.locals.errorModalTitle='Error';
  }
  return res.render('Users/login');
});

router.post('/users/login',function(req,res,next){
    passport.authenticate('local', function(err, user, info) {
      var redirect = req.body.redirect == '' ? '/' : req.body.redirect;
      if (err) { return next(err); }
      if (!user) { return res.redirect('/users/login?loginErr=1&redirect=' + redirect); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect(redirect);
      });
    })(req, res, next);
});

router.get('/users/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/users/register', function (req, res, next) {
  return res.render('Users/register');
});

router.post('/users/register', function (req, res, next) {
  try{
    res.locals.model = new UserModel(req.body.username, req.body.password, req.body.email, null);
    res.locals.errorView='Users/register';
		return next();
  }catch(ex){
    next(ex);
  }
},function (req, res, next){
  db.setClosure({username:res.locals.model.Username});
  db.find(function predicate(item){
    return item.Username==username;
  }, function cb(err,user){
    if(err)
      return next(err);
    
    if(user){
      err = new Error('User already exists');
      return next(err);
    }
    
    db.add(res.locals.model, function(errAdd, insCnt){
      if(errAdd)
        return next(errAdd);
        
      var model={title:'Register', message:'User registered, redirecting...', redirUrl:'/'}
      res.render('redirect', model);  
    });
  });
});

router.use('/users/register', function(err,req,res,next){
  var errorView = res.locals.errorView || 'error';
	res.render(errorView, {username:req.body.username
    , password:req.body.password
    , email:req.body.email
    , errorModalMessage:err.message
    , errorModalTitle:'Error'
  });
});

module.exports = router;