var userController    = require('./users/userController.js'),
    roadmapController = require('./roadmaps/roadmapController.js'),
    nodeController    = require('./nodes/nodeController.js');

module.exports = function (apiRouter) {

  /*
   *      All routes begin with /api/
   */

  apiRouter.get( '/login',  userController.login);
  apiRouter.post('/signup', userController.createUser);


  /*
   *      User Routes
   */
  apiRouter.get(   '/users',           userController.getUsers);
  apiRouter.get(   '/users/:username', userController.getUserByName);
  apiRouter.delete('/users/:username', userController.deleteUserByName);


  /*
   *      Roadmap Routes
   */
   apiRouter.post(  '/roadmaps',            roadmapController.createRoadmap  );
   apiRouter.get(   '/roadmaps',            roadmapController.getRoadmaps    );
   apiRouter.get(   '/roadmaps/:roadmapID', roadmapController.getRoadmapByID );
   apiRouter.put(   '/roadmaps/:roadmapID', roadmapController.updateRoadmap  );
   apiRouter.delete('/roadmaps/:roadmapID', roadmapController.deleteRoadmap  );


   /*
    *      Node Routes
    */

    apiRouter.get(   '/nodes/:nodeID', nodeController.createNode);
    apiRouter.put(   '/nodes/:nodeID', nodeController.updateNode);
    apiRouter.delete('/nodes/:nodeID', nodeController.deleteNode);


};
