var mongoose = require("mongoose");

// define the schema for our comment model
var commentSchema = mongoose.Schema({
  comment:{
    type: String,
    required: true
  },
  visitor:{
    type: String,
    required: true
  },
  isApproved:{
    type: Boolean,
    required: true,
    default: false
  },
  isDeleted:{
    type: Boolean,
    required: true,
    default: false
  },
},
  {
    timestamps: true
  }
);

const Comment = (module.exports = mongoose.model("Comment", commentSchema));

//Create
module.exports.createComment = function(newComment, callback) {
  newComment.save(callback);
};

//Update
module.exports.updateComment = function(id, params, callback) {
  Comments.findByIdAndUpdate(id, params, { new: true }, callback);  
};


module.exports.getAll = function(query, options, callback) {
  Comments.find(query, options, function(err, doc) {
    if (doc) {
      callback(doc);
    }
    if(err){
      callback(false);
    }
  });
}; //end exports getRecords
