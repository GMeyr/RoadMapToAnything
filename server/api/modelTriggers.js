// This file contains all pre and post hooks for db
// interaction with our models. 

// Triggers for all db models when created.
var setCreatedTimestamp = function (next) {
  var now = Date.now();

  if (this.isNew) this.created = now;
  this.updated = now;

  next();
};

// Triggers for all db models when updated.
var setUpdatedTimestamp = function (next) {
  this.update({},{ $set: { updated: Date.now() } });

  next();
};


/* * * * * * * * * * * * * * * * * * * * * 
 *                 USER                  *
 * * * * * * * * * * * * * * * * * * * * */

var preUserUpdate = function (next) {
  var update = this._update;
  var arrayNames = [
    'inProgress.roadmaps',
    'inProgress.nodes',
    'completedRoadmaps'
  ];
  
  arrayNames.forEach(function (name) {
    if (update[name]) {
      update['$push'] = update['$push'] || {};
      update['$push'][name] = update[name];
      delete update[name];
    }
  });

  next();
};


// All valid hooks are included here for reference.
module.exports.setUserHooks = function(UserSchema) {
  UserSchema.pre('save', function(next) {
    setCreatedTimestamp.call(this, next);
  });

  UserSchema.pre('remove', function(next) {
    // TODO: Decide how roadmaps behave when their author is removed.
    next();
  });

  UserSchema.pre('update', function(next) {
    var query = this;
    preUserUpdate.call(query, function() {
      setUpdatedTimestamp.call(query, next);
    });
  });

  UserSchema.pre('findOneAndUpdate', function(next) {
    var query = this;
    preUserUpdate.call(query, function() {
      setUpdatedTimestamp.call(query, next);
    });
  });

  UserSchema.pre('findByIdAndUpdate', function(next) {
    var query = this;
    preUserUpdate.call(query, function() {
      setUpdatedTimestamp.call(query, next);
    });
  });

};


/* * * * * * * * * * * * * * * * * * * * * 
 *               ROADMAP                 *
 * * * * * * * * * * * * * * * * * * * * */

module.exports.setRoadmapHooks = function(RoadmapSchema) {
  RoadmapSchema.pre('save', function(next) {
    // On creation of a Roadmap, push it's ID to the author's roadmaps array
    if (this.isNew) {
      var User = require('./users/userModel.js');
      var authorID = this.author;
      var roadmapID = this._id;

      var update = { $push:{ authoredRoadmaps: roadmapID } };

      User.findByIdAndUpdate(authorID, update)
        .exec(function(err){ if (err) throw err; });     
    }

    setCreatedTimestamp.call(this, next);
  });

  RoadmapSchema.pre('remove', function(next) {
    // On deletion of a Roadmap, remove it's ID from the author's roadmaps array,
    // and delete all associated nodes
    console.log('remove roadmap');
    var User = require('./users/userModel.js');
    var Node = require('./nodes/nodeModel.js');
    var authorID = this.author;
    var roadmapID = this._id;
    var nodes = this.nodes;

    var userUpdate = { $pull:{ authoredRoadmaps: roadmapID } };

    User.findByIdAndUpdate(authorID, userUpdate)
      .exec(function(err){ if (err) throw err; });  

    nodes.forEach(function(nodeID){
      Node.findByIdAndRemove(nodeID)
        .exec(function(err){ if (err) throw err; });  
    });

    next();
  });

  RoadmapSchema.pre('update', function(next) {
    setUpdatedTimestamp.call(this, next);
  });

  RoadmapSchema.pre('findOneAndUpdate', function(next) {
    setUpdatedTimestamp.call(this, next);
  });

  RoadmapSchema.pre('findByIdAndUpdate', function(next) {
    setUpdatedTimestamp.call(this, next);
  });
};


/* * * * * * * * * * * * * * * * * * * * * 
 *                 NODE                  *
 * * * * * * * * * * * * * * * * * * * * */

module.exports.setNodeHooks = function(NodeSchema) {
  NodeSchema.pre('save', function(next) {
    // On creation of a Node, push it's ID to the parent Roadmaps nodes array
    if (this.isNew) {
      var Roadmap = require('./roadmaps/roadmapModel.js');
      var parentRoadmapID = this.parentRoadmap;
      var newNodeID = this._id;

      var update = { $push:{ nodes: newNodeID } };

      Roadmap.findByIdAndUpdate(parentRoadmapID, update)
        .exec(function(err){ if (err) throw err; });     
    }

    setCreatedTimestamp.call(this, next);
  });

  NodeSchema.pre('remove', function(next) {
    // On deletion of a Node, remove it's ID from the parent Roadmaps nodes array
    var Roadmap = require('./roadmaps/roadmapModel.js');
    var parentRoadmapID = this.parentRoadmap;
    var deletedNodeID = this._id;

    var update = { $pull:{ nodes: deletedNodeID } };

    Roadmap.findByIdAndUpdate(parentRoadmapID, update)
      .exec(function(err){ if (err) throw err; });  

    next();
  });

  NodeSchema.pre('update', function(next) {
    setUpdatedTimestamp.call(this, next);
  });

  NodeSchema.pre('findOneAndUpdate', function(next) {
    setUpdatedTimestamp.call(this, next);
  });

  NodeSchema.pre('findByIdAndUpdate', function(next) {
    setUpdatedTimestamp.call(this, next);
  });

};