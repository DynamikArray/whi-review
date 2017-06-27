// route middleware to ensure user is logged in
module.exports.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

// route middleware to ensure user is logged in
module.exports.isAdmin = function (req, res, next) {
    if (req.isAuthenticated()){
      if(req.user.account_type == 'admin'){
        return next();
      }else{
        res.redirect('/login');
      }
    }else{
      res.redirect('/login');
    }
}
