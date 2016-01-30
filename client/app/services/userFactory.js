angular.module('services.user', [])

.factory('User', ['$http', function($http){

  var User = {};

  // Standard response after for auth actions
  var authResponse = function (res, message) {
    console.log(res.data.data.username, message);
    localStorage.setItem('user.username', res.data.data.username);
    localStorage.setItem('user.authToken', res.data.data.authToken);
    return res.data.data;
  };


  User.login = function(username, password) {
    return $http({
      method: 'GET',
      url: '/api/login',
      params: {
        username: username,
        password: password
      }
    })
    .then(function (res) {
      return authResponse(res, 'successfully logged in.');
    });
  };

  User.signup = function(user) {
    return $http.post('/api/signup', user)
    .then(function (res) {
      return authResponse(res, 'successfully signed up.');
    });
  };

  User.logout = function() {
    var username = localStorage.getItem('user.username');
    localStorage.removeItem('user.username');
    localStorage.removeItem('user.authToken');
    console.log(username, 'successfully logged out.');
  };

  User.isLoggedIn = function() {
    return !!localStorage.getItem('user.authToken');
  };




  return User;

}]);