var User = require('./userModel.js'),
    Promise = require('bluebird'),
    getAuthHeader = require('basic-auth'),
    handleError = require('../../util.js').handleError,
    handleQuery = require('../queryHandler.js'),
    bcrypt = require('bcrypt-nodejs'),
    getAuthHeader = require('basic-auth');
    

bcrypt.hash = Promise.promisify(bcrypt.hash); // Promise.promisifyAll did not work

var populateFields = 'authoredRoadmaps.nodes inProgress.roadmaps.nodes inProgress.nodes completedRoadmaps.nodes';

var hashPassword = function (user) {
  return [ user, bcrypt.hash(user.password, null, null) ];
};

var generateAuthToken = function (user, hashedPassword) {
  var encodedHash = new Buffer(hashedPassword, 'ascii').toString('base64');
  return {
    username: user.username,
    authToken: encodedHash
  };
};

module.exports = {

  returnId : function( username ) {
    return User.findOne({username: username})
    .then(function (user) {
      return user._id;
    });
  },

  createUser : function(req, res, next){
    var newUser = req.body;

    User(newUser).save()
      .then( hashPassword )
      .spread( generateAuthToken )
      .then(function(results){
        res.status(201).json({data: results});
      })
      .catch(handleError(next));
  },

  login : function(req, res, next){
    var credentials = {
      username: req.query.username,
      password: req.query.password,
    };

    User.findOne(credentials)
      .then(function(validUser){
        if (!validUser) res.sendStatus(401);  // unauthorized: invalid credentials
        else return hashPassword(validUser);
      })
      .spread(generateAuthToken)
      .then(function(results){
        res.status(200).json({data: results});
      })
      .catch(handleError(next));
  },

  getUsers: function(req, res, next) {
    var dbArgs = handleQuery(req.query);

    User.find(dbArgs.filters, dbArgs.fields, dbArgs.params)
      .deepPopulate(populateFields)
      .then(function (users) {
        if (!users) return res.sendStatus(404);
        res.status(200).json({data: users});
      })
      .catch(handleError(next));
  },

  getUserByName: function(req, res, next) {
    User.findOne({username: req.params.username})
      .deepPopulate(populateFields)
      .then( function (user) {
        if (!user) return res.sendStatus(404); 
        res.status(200).json({data: user});
      })
      .catch(handleError(next));
  },

  updateUserByName: function(req, res, next) {
    var username = getAuthHeader(req).name;
    if (req.params.username !== username) res.sendStatus(403);

    var updateableFields = ['password','firstName','lastName','imageUrl'];
    var updateCommand = {};

    updateableFields.forEach(function(field){
      if (req.body[field] !== undefined) updateCommand[field] = req.body[field];
    });

    User.findOneAndUpdate({username: username}, updateCommand, {new: true})
      .deepPopulate(populateFields)
      .then( function (user) {
        if (!user) return res.sendStatus(404); 
        res.status(200).json({data: user});
      })
      .catch(handleError(next));
  },

  deleteUserByName: function(req, res, next) {
    var username = getAuthHeader(req).name;
    if (req.params.username !== username) res.sendStatus(403);

    User.findOne({username: username})
      .deepPopulate(populateFields)
      .then( function (user) {
        if (!user) return res.sendStatus(404);
        user.remove();
        res.status(201).json({data: user});
      })
      .catch(handleError(next));
  },

  // Handles requests to /api/roadmaps/:roadmapID/:action
  roadmapAction: function(req, res, next) {
    var username  = getAuthHeader(req).name;
    var roadmapID = req.params.roadmapID;
    var action    = req.params.action.toLowerCase();

    var actionMap = {
      
      follow  : { $addToSet: {'inProgress.roadmaps': roadmapID} },
      
      unfollow: { $pull:     {'inProgress.roadmaps': roadmapID} },

      // triggers $pull from inProgress.nodes and inProgress.roadmaps via hooks
      complete: { $addToSet: {'completedRoadmaps'  : roadmapID} }

    };

    if ( !actionMap.hasOwnProperty(action) ) res.sendStatus(404);

    User.findOneAndUpdate({username: username}, actionMap[action], {new: true})
      .deepPopulate(populateFields)
      .then( function (user) {
        if (!user) return res.sendStatus(404); 
        res.status(200).json({data: user});
      })
      .catch(handleError(next));
  },

  // Handles requests to /api/nodes/:nodeID/complete
  completeNode: function(req, res, next) {
    var username = getAuthHeader(req).name;
    var nodeID   = req.params.nodeID;

    var updateCommand = { $addToSet: {'inProgress.nodes': nodeID} };

    User.findOneAndUpdate({username: username}, updateCommand, {new: true})
      .deepPopulate(populateFields)
      .then( function (user) {
        if (!user) return res.sendStatus(404); 
        res.status(200).json({data: user});
      })
      .catch(handleError(next));
  }


};

