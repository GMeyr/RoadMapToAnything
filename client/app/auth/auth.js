angular.module('app.auth', [])

.controller('AuthController', ['$scope', '$http', function($scope, $http){
<<<<<<< HEAD

  $scope.attemptedUsername = "not yet set";
  $scope.attemptedPassword = "not yet set";

  $scope.showUnauthMsg = false;

  $scope.attemptLogin = function () {
    $scope.showUnauthMsg = false;
    $http.get('/api/login', {
      username: $scope.attemptedUsername,
      password: $scope.attemptedPassword
    })
    .then(
      //success callback
      function(res){
        console.log('sent login credentials');
        console.log('res.data', res.data);
        res.redirect('/#/dashboard?username=' + res.body.username);
      },
      //error callback
      function(res){
        console.log('res:', res);
        if(res.status === 401){
          console.log('unauthorized credentials');
          $scope.showUnauthMsg = true;
        }
      }
      );
  };
=======
  $scope.test = function(){
    console.log('Auth controller is working');
  };
  $scope.test();

  $scope.attemptLogin = function () {
    $http.get('/api/login?username=' + $scope.attemptedUsername + '&password=' + $scope.attemptedPassword )
    .then(
      //success callback
      function(){
        console.log('sent login credentials');
      },
      //error callback
      function(err){
        console.log('error sending credentials', err);
      }
      );
  };
>>>>>>> add and style signin form
}]);