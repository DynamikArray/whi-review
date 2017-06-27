var isAuth = require('../modules/isAuth.js');

//Handle all user routes
// if not logged in, then send to login page?

module.exports = function (app,passport){

  app.get('/admin/comments', isAuth.isAdmin, function(req, res){
    comments = false;
    
    res.render('admin/comments.ejs',{
      user:req.user,
      message: req.flash('adminMessage'),
      comments: comments
    })
  })//end app.get('/admin')


};//end module.exports
