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

    User.findOne({username: author})
      .then(function (user) {
        newRoadmap.author = user._id;
        return Roadmap(newRoadmap).save();
      })
      .then(function(dbResults){
        res.status(201).json({data: dbResults});
      })
      .catch(handleError(next));
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
  }

};