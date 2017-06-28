commentsModel = require('../models/Comment');
var xssFilters = require("xss-filters");
var sanitizeHtml = require("sanitize-html");

//var decode = require("unescape");

var isAuth = require('../modules/isAuth.js');
var maxLength = 5000;

//Handle all user routes
// if not logged in, then send to login page?

module.exports = function (app,passport){
  app.post('/comments/add', function(req, res){
    if(!req.user)
      user = false;
    user = req.user

    if(req.body.comment.length <= maxLength){

      xssFilters.inHTMLData(req.body.comment);
      cleanQuestion = sanitizeHtml(req.body.comment, {
        allowedTags: [""]
      });

      xssFilters.inHTMLData(req.body.visitor);
      cleanQuestion = sanitizeHtml(req.body.visitor, {
        allowedTags: [""]
      });

      let newComment = new commentsModel({
        comment: req.body.comment,
        visitor: req.body.visitor
      });

      commentsModel.createComment(newComment, (err, comment)=>{
        if(!err && comment){
          req.flash('addCommentMessage', 'Thank you for submitting your comment.');
          res.redirect('/#comment');
        }else{
          console.log(err);
          req.flash('addCommentMessage', 'There was an error with your comment.' + err.message);
          res.redirect('/#comment');
        }
      });//end createComment
    }else{
      req.flash('addCommentMessage', 'Your comment message was too long.');
      res.redirect('/#comment');
    }//end if length > maxLength
  })//end app.get('/comments/add')


  app.get('/comments/approve/:id',  function(req, res){
    Comments.updateComment({_id :req.params.id}, {isApproved: true}, (comment, err)=>{
      if(!err || comment){
        req.flash('adminMessage','The comment has been approved.')
        res.redirect('/admin/comments');
      }else{
        req.flash('adminMessage','There was an error approving your comment' + err.message)
        res.redirect('/admin/comments');
      }
    });//end getAllComments
  })//end app.get('/admin')


  app.get('/comments/delete/:id',  function(req, res){
    Comments.updateComment({_id :req.params.id}, {isDeleted: true}, (comment, err)=>{
      if(!err || comment){
        req.flash('adminMessage','The comment has been marked as deleted.')
        res.redirect('/admin/comments');
      }else{
        req.flash('adminMessage','There was an error deleting the comment' + err.message)
        res.redirect('/admin/comments');
      }
    });//end getAllComments
  })//end app.get('/admin')


};//end module.exports
