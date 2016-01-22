angular.module('app.main', [])

.controller('MainController', function($scope){
  $scope.test = function(){
    console.log('Main controller is working');
    return 'Main controller is working';
  };

  $scope.msg = "Hello from the MainController";

  $scope.test();
});