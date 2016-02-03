var Roadmap = require('./roadmapModel.js'),
    User = require('../users/userModel.js'),
    ObjectId = require('mongoose').Types.ObjectId,
    handleError = require('../../util.js').handleError,
    handleQuery = require('../queryHandler.js'),
    getAuthHeader = require('basic-auth');
    

module.exports = {

  createRoadmap : function (req, res, next) {
    var author = getAuthHeader(req).name;
    var newRoadmap = req.body;
    console.log('API: creating roadmap');
    console.log('API: author', author);
    console.log('API: creating roadmap', newRoadmap);

    User.findOne({username: author})
      .then(function (user) {
        newRoadmap.author = user._id;
        return Roadmap(newRoadmap).save();
      })
      .then(function(dbResults){
        res.status(201).json({data: dbResults});
      })
      .catch(
        function(){
          console.log('API: error creating roadmap');
          handleError(next)
        });
  },

  getRoadmaps : function (req, res, next) {
    var dbArgs = handleQuery(req.query);

    Roadmap.find(dbArgs.filters, dbArgs.fields, dbArgs.params)
      .populate('author nodes')
      .then(function(dbResults){
        res.json({data: dbResults});
      })
      .catch(handleError(next));
  },

  getRoadmapByID : function (req, res, next) {
    var _id = req.params.roadmapID;
    Roadmap.findById(_id)
      .populate('author nodes')
      .then(function(dbResults){
        res.json({data: dbResults});
      })
      .catch(handleError(next));
  },

  updateRoadmap : function (req, res, next) {
    var _id = req.params.roadmapID;
    var updateCommand = req.body;
    Roadmap.findByIdAndUpdate(_id, updateCommand, {new: true})
      .populate('author nodes')
      .then(function(dbResults){
        res.json({data: dbResults});
      })
      .catch(handleError(next));
  },

  deleteRoadmap : function (req, res, next) {
    var _id = req.params.roadmapID;
    Roadmap.findOne({_id:_id})
      .populate('author nodes')
      .then(function(roadmap){
        if (roadmap) roadmap.remove();
        res.json({data: roadmap});
      })
      .catch(handleError(next));
  },

  updateRoadmapUpVote : function (req, res, next) {
    var _id = req.params.roadmapID;
    // console.log('this is the REQ BODY', req.body);
    // console.log('this is the REQ BODY USERNAME', req.body.username); 
    //$addToSet will only add usernames not already in the upvotes array
    var updateUpVote = { $addToSet: { upvotes: req.body.username } };
    //find roadmap by id and trigger the $addToSet command
    Roadmap.findByIdAndUpdate(_id, updateUpVote, {new: true})
      .then(function(dbResults){
        console.log('DATA FROM SERVER AFTER UPVOTE:', dbResults);
        // res.write(res.statusCode.toString());
        // res.send(data);
        res.json({data: dbResults});
      })
      .catch(handleError(next));
  },

  updateRoadmapDownVote : function (req, res, next) {
    var _id = req.params.roadmapID;
    console.log('this is the REQUEST from server controller in downvote:', req);
    console.log('this is the REQ BODY USERNAME:', req.body.username); 
    // var username = "'" + req.body.username + "'";
    var updateDownVote = { $pull : { upvotes: req.body.username } };
    Roadmap.findByIdAndUpdate(_id, updateDownVote, {new: true})
    // Roadmap.findByIdAndUpdate(_id, updateDownVote)
     .then(function(dbResults){
        console.log('server controller: DATA FROM SERVER AFTER DOWNVOTE:', dbResults);
        // res.write(res.statusCode.toString());
        // res.send(data);
        res.json({data: dbResults});
      })
      .catch(handleError(next));
  }

};