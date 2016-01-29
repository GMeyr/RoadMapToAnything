angular.module('app.creation', [])

.controller('CreationController', function($scope, $http, $state){

  // As user will be building a brand new roadmap, the currently  
  // active one is removed from local storage.
  localStorage.removeItem('user.currentRoadMap');

  var buildRoadmap = function() {
    author = localStorage.getItem('user.username') || 'bowieloverx950';

    return {
      title: $scope.roadmapTitle,
      description: $scope.roadmapDescription,
      author: author
    };
  };

  var postRoadmap = function(roadmap) {
    var user = localStorage.getItem('user.username');
    var token = localStorage.getItem('user.authToken');
    var encodedAuthHeader = btoa(user + ':' + token);

   return $http({
      method: 'POST',
      url: '/api/roadmaps',
      data: roadmap,
      headers: {
        'Authorization': 'Basic ' + encodedAuthHeader
      }
    }).then(function (res) {
      localStorage.setItem('user.currentRoadMap', res.data.data._id);
      console.log('Roadmap created:', res.data.data);
    }, function(err){
      if (err) return err;
    });

  };

  var buildNode = function() {
    var parent = localStorage.getItem('user.currentRoadMap');

    return {
      title: $scope.nodeTitle,
      description: $scope.nodeDescription,
      resourceType: $scope.nodeType,
      resourceURL: $scope.nodeUrl,
      imageUrl: $scope.nodeImageUrl,
      parentRoadmap: parent
    };
  };

  var postNode = function(node) {

    return $http.post('/api/nodes', node)
    .then(function (res) {
      console.log('Node created:', res.data.data);
    });

  };

  $scope.submitAndRefresh = function() {
    $scope.submitNode()
    .then(function() {
      Materialize.updateTextFields();
    })
    
  };

  $scope.submitAndExit = function() {
    $scope.submitNode()
    .then(function() {
      $state.go('roadmapTemplate');
    });
    
  };

  $scope.submitNode = function() {
    if (!localStorage.getItem('user.currentRoadMap')) {

      postRoadmap(buildRoadmap())
      .then(function (err) {
        if (err) return console.log(err);
        return postNode(buildNode());
      });

    } else {
      return postNode(buildNode());
    }
  };

});