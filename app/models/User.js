var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
  //local passport users
  local :{
    email: String,
    password: String,
    resetPasswordToken : String,
    resetPasswordExpires: String
  },
  account_type :{
    default: "user",
    type:   String
  },
});


// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

const User = (module.exports = mongoose.model("User", userSchema));
