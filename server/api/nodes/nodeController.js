var Node        = require('./nodeModel.js'),
    handleError = require('../../util.js').handleError,
    handleQuery = require('../queryHandler.js');

module.exports = {

  createNode : function (req, res, next) {
    var newNode = req.body;
    // Support /nodes and /roadmaps/roadmapID/nodes
    newNode.parentRoadmap = newNode.parentRoadmap || req.params.roadmapID;
    Node(newNode).save()
      .then(function(dbResults){
        res.status(201).json({data: dbResults});
      })
      .catch(handleError(next));
  },

  getNodeByID : function (req, res, next) {
    var _id = req.params.nodeID;
    Node.findById(_id)
      .populate('parentRoadmap')
      .then(function(dbResults){
        res.json({data: dbResults});
      })
      .catch(handleError(next));
  },

  updateNode : function (req, res, next) {
    var _id = req.params.nodeID;
    var updateCommand = req.body;
    Node.findByIdAndUpdate(_id, updateCommand)
      .populate('parentRoadmap')
      .then(function(dbResults){
        res.json({data: dbResults});
      })
      .catch(handleError(next));
  },

  deleteNode : function (req, res, next) {
    var _id = req.params.nodeID;
    Node.findOne({_id:_id})
      .populate('parentRoadmap')
      .then(function(node){
        node.remove();
        res.json({data: node});
      })
      .catch(handleError(next));
  }

};