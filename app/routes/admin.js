var isAuth = require('../modules/isAuth.js');

//Handle all user routes
// if not logged in, then send to login page?

module.exports = function (app,passport){

  app.get('/admin/comments', isAuth.isAdmin, function(req, res){
    Comments.getAll({isApproved :false, isDeleted:false}, false, (comments, err)=>{
      if(!err || comments){
        res.render('admin/comments.ejs',{user:user, comments:comments, message:req.flash('adminMessage'), timeAgo: TimeAgo});
      }else{
        console.log(err);
        res.render('admin/comments.ejs',{user:user, comments:false, message:req.flash('adminMessage'), timeAgo: TimeAgo});
      }
    });//end getAllComments
  })//end app.get('/admin')




};//end module.exports
