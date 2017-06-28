Comments = require('../models/Comment');

TimeAgo = require('node-time-ago');

module.exports = function (app,passport){
  app.get("/", function(req,res){

    //setup our user object
    if(!req.user){
      user = false;
    }else{
      user = req.user
    }

    Comments.getAll({isApproved :true, isDeleted:false}, false, (comments, err)=>{
      if(!err || comments){
        res.render('index.ejs',{user:user, comments:comments, message:req.flash('addCommentMessage'), timeAgo: TimeAgo});
      }else{
        console.log(err);
        res.render('index.ejs',{user:user, comments:false, message:req.flash('addCommentMessage')});
      }
    });//end getAllComments

  })//end app.get



  //Catch all for any non defined routes

  app.get('**', function(req,res){
    res.redirect('/');
  });


}//end module.exports
