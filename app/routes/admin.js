var isAuth = require('../modules/isAuth.js');

//Handle all user routes
// if not logged in, then send to login page?

module.exports = function (app,passport){

  app.get('/admin/comments', isAuth.isAdmin, function(req, res){
  //app.get('/admin/comments', isAuth.isAdmin, function(req, res){

  console.log(req.query.isApproved);
    var isApproved = false, isDeleted = false;

    if("undefined" !== typeof req.query.isApproved){
      isApproved = req.query.isApproved
    }

    if("undefined" !== typeof req.query.isDeleted){
      isDeleted = req.query.isDeleted
    }

    Comments.getAll({isApproved : isApproved, isDeleted:isDeleted}, false, (comments, err)=>{
      if(!err || comments){
        res.render('admin/comments.ejs',{user:user, comments:comments, message:req.flash('adminMessage'), timeAgo: TimeAgo, query:req.query});
      }else{
        console.log(err);
        res.render('admin/comments.ejs',{user:user, comments:false, message:req.flash('adminMessage'), timeAgo: TimeAgo, query:req.query});
      }
    });//end getAllComments
  })//end app.get('/admin')
};//end module.exports
