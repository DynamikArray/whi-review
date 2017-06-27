module.exports = function (app,passport){
  app.get("/", function(req,res){
    if(!req.user)
      user = false;
    user = req.user

    res.render('index.ejs',{user:user});
  })//end app.get

  app.get('**', function(req,res){
    res.redirect('/');
  });

}//end module.exports
