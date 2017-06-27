var isAuth = require('../modules/isAuth.js');

//Handle all user routes
// if not logged in, then send to login page?

module.exports = function (app,passport){

  app.get('/signup/:allow', function(req, res){
    if(req.params.allow == 'signmeup'){
      res.render('signup', {message:req.flash('signupMessage'), user:false});
    }else{
      res.redirect('/');
    }

  });//end app.get/signup

  //signup  strategey
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/user',
    failureRedirect : '/signup',
    failureFlash    : true
  }));//end app.post signup


  app.get("/login", function(req,res){
    if(!req.user)
      user = false;
    user = req.user

    res.render('login.ejs',{message:req.flash('loginMessage'), user:user});
  });//end app.get

  //signup  strategey
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/user',
    failureRedirect : '/login',
    failureFlash    : true
  }));//end app.post signup

  app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
  });//end app.get


  app.get("/user", isAuth.isLoggedIn, function(req,res){
    if(req.user.account_type == 'admin'){
      res.redirect('/admin/comments.ejs');
    }else{
      res.render('index.ejs',{comments: false, user:req.user});
    }
  });//end app.get



};//end module.exports
