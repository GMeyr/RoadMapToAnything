var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    deepPopulate = require('mongoose-deep-populate')(mongoose);

    hooks    = require('../modelTriggers.js');

var UserSchema = new mongoose.Schema({
  username          : { type: String, required: true, unique: true },
  password          : { type: String, required: true },
  firstName         : { type: String },
  lastName          : { type: String },
  imageUrl          : { type: String, default: 'images/newUserIcon.png'},
  authoredRoadmaps  : [ {type: ObjectId, ref: 'Roadmap'} ],
  inProgress        : 
      {
          roadmaps  : [ {type: ObjectId, ref: 'Roadmap'} ],
          nodes     : [ {type: ObjectId, ref: 'Node'} ]
      },
  completedRoadmaps : [ {type: ObjectId, ref: 'Roadmap'} ],
  facebookUserId    : { type: String, unique: true },
  created           : { type: Date },
  updated           : { type: Date },
  comments          : [ {type: ObjectId, ref: 'Comment'} ]
});

UserSchema.plugin(deepPopulate);

hooks.setUserHooks(UserSchema);

module.exports = mongoose.model('User', UserSchema);
