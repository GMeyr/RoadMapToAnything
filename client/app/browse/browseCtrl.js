angular.module('browse.ctrl', ['services.user', 'browse.factory'])

.controller('BrowseController', ['$scope', '$state', 'User', 'Browse',  function($scope, $state, User, Browse){
  $scope.mapData = [];

  $scope.showSigninMsg = false;
  $scope.isLoggedIn = User.isLoggedIn;

  $scope.addTotalNodesOfMaps = Browse.addTotalNodesOfMaps;
  $scope.getMapData = Browse.getMapData;
  $scope.followMap = User.followMap;
  $scope.goToMap = Browse.goToMap;

  $scope.getMapData(function(mapData){
    $scope.mapData = mapData;
  });


  $scope.goToDash = function () {
      $state.go('home.dashboard');
    }

  $scope.goToMap = function (mapID){
    $state.go('home.roadmapTemplate', { 'roadmapID': mapID });
  };

  

}]);
