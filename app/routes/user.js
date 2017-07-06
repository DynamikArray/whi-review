const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');

var env = require('dotenv').config();
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



  app.get("/forgot", function(req, res){
    res.render('forgot.ejs', {message: req.flash('message'), error: req.flash('error')});
  })//end /forgot

  app.post("/forgot", function(req, res, next){
    async.waterfall([
      //array of functions to run in order
      function(done){
        //create a token
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },//end function

      function(token, done) {
        User.findOne({ "local.email": req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }

          user.local.resetPasswordToken = token;
          user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },//end function
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // secure:true for port 465, secure:false for port 587
          auth: {
              user: process.env.EMAIL_NAME,
              pass: process.env.EMAIL_PASS
          }
        });

        var mailOptions = {
          to: user.local.email,
          from: process.env.EMAIL_ADDRESS,
          subject: 'WilsonHomeImprovementsReview - Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('message', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
          done(err, 'done');
        });
      }//end function
    ], function(err){
        if(err) return next(err);
        res.redirect('/forgot');
    });//end waterfall

  })//end POST app/forget


  app.get('/reset/:token', function(req, res) {
    User.findOne({ "local.resetPasswordToken": req.params.token, "local.resetPasswordExpires": { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {
        user: req.user,
        message: req.flash('message'),
        error: req.flash('error')
      });
    });
  });


  app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        //find a usser
        User.findOne({ "local.resetPasswordToken": req.params.token, "local.resetPasswordExpires": { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          user.local.password = req.body.password;
          user.local.resetPasswordToken = undefined;
          user.local.resetPasswordExpires = undefined;

          user.save(function(err){
            done(err, user);
          });//user save

        });//user find one
      }, //end function
      function(user, done){
        var smtpTransport = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // secure:true for port 465, secure:false for port 587
          auth: {
              user: process.env.EMAIL_NAME,
              pass: process.env.EMAIL_PASS
          }
        });

        var mailOptions = {
          to: user.local.email,
          from: process.env.EMAIL_ADDRESS,
          subject: 'Password Change - WilsonHomeImprovementsReview',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('loginMessage', 'Success! Your password has been changed.');
          done(err, 'done');
        });
      }//end mail user
    ], function(err) {
      res.redirect('/login');
    });
  });



  app.get("/user/reset", function(req,res){
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASS
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
        to: 'brian@monumentixwebdesign.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plain text body
        html: '<b>Hello world ?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
  });//end /user/reset

};//end module.exports
