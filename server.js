var express  = require('express');
var app      = express();

var helmet = require('helmet');
app.use(helmet());

var env = require('dotenv').config();
var port     = process.env.PORT || 5000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

require('./app/modules/passport.js')(passport);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
  useMongoClient : true
}); // connect to our database

app.use(morgan('dev')); //log requests to console.
app.use(cookieParser()); //

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));


app.set("view engine", "ejs"); // set up ejs for templating
app.use(express.static("dist"));

// required for passport

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:true,
  saveUninitialized:true
})); // session settings

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require("./app/routes/comments.js")(app, passport); // load home and catch all last
require("./app/routes/user.js")(app, passport); // load our routes and pass in our app and fully configured passport
require("./app/routes/admin.js")(app, passport); // load our routes and pass in our app and fully configured passport
require("./app/routes/common.js")(app, passport); // load home and catch all last

app.listen(port);
//server.listen(3000);
console.log("Server is happening on  " + port);
