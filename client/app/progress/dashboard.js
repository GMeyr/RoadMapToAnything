angular.module('app.dash', [])

.controller('DashboardController', ['$scope','$http', '$stateParams', function($scope, $http, $stateParams){
  console.log("dash controller is working");

  console.log('$stateParams', $stateParams);

  $scope.username = '';

  $scope.followedMapsResponseBody = {};

  $scope.myMapsResponseBody = {};

  $scope.hideMyMaps = true;

  $scope.showMyMaps = function(){
      $scope.hideMyMaps = false;
      angular.element( '#myMapsBtn' ).addClass( 'pressed' );
      angular.element( '#followedBtn' ).removeClass( 'pressed' );
  };

  $scope.showFollowed = function(){
      $scope.hideMyMaps = true;
      angular.element( '#myMapsBtn' ).removeClass( 'pressed' );
      angular.element( '#followedBtn' ).addClass( 'pressed' );
  };

  $scope.dummyFollowed = [{
      _id: 01,
      title: 'The Legacy of Virginia Wolfe',
      nodes: 23,
      completed: 2
    },{
      _id: 02,
      title: 'How To Tell If Your Restaurant Idea Is Good',
      nodes: 12,
      completed: 5
    },{
      _id: 03,
      title: 'Be A Champion Horseshoe Player',
      nodes: 14,
      completed: 14
    }];

    $scope.dummyMyMaps = [{
      _id: 04,
      title: 'Learn To Make Paper With Old Jeans',
      nodes: 5,
      completed: 2
    },{
      _id: 05,
      title: 'An Overview of Japanese Film',
      nodes: 20,
      completed: 15
    },{
      _id: 06,
      title: 'Let\'s Learn Algebra',
      nodes: 15,
      completed: 0
    }];

    addPercentCompleteAttr();

  //getDashboardData();


  // helper functions

  function addPercentCompleteAttr (){
    $scope.dummyFollowed.forEach(function(map){
      map.percentComplete = Math.floor((map.completed / map.nodes) * 100);
    });

    $scope.dummyMyMaps.forEach(function(map){
      map.percentComplete = Math.floor((map.completed / map.nodes) * 100);
    });
  }

  function getDashboardData (){
    angular.element(document).ready( function(){
        getMyMaps();
        getFollowedMaps();
      });
  }


  function getMyMaps (){
      console.log('calling getMyMaps');
  //    $http.get('http://roadmaptoanything.herokuapp.com/#/api/users/' + $scope.userName )
        $http.get('localhost:3000/#/api/users/' + $scope.userName )
          .then(function(response){
            console.log('response.body.data', response.body.data);
            $scope.myMaps = response.body.data.roadmaps;
            }, function(err){
              console.log("error with MyMaps request", err);
            });
    }

  function getFollowedMaps (){
      console.log('calling getFollowedMaps');
  //    $http.get('http://roadmaptoanything.herokuapp.com/#/api/users/' + $scope.userName )
        $http.get('localhost:3000/#/api/users/' + $scope.userName )
          .then(function(response){
            console.log('response.body.data', response.body.data);
            $scope.followed = response.body.data.roadmaps;
            }, function(err){
              console.log('error with followedMaps request', err);
            });
    }
}]);


