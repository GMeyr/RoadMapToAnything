angular.module('app', [
  'ui.router',
  'app.main',
  'app.auth',
  'app.dash',
  'ngMaterial'
  ])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      views: {
        'header': {
          templateUrl: 'app/main/main.header.html',
          controller: 'MainController'
        },
        'content': {
          templateUrl: 'app/main/main.content.html',
          controller: 'MainController',
        },
        'footer': {
          templateUrl: 'app/main/main.footer.html',
          controller: 'MainController'
        },
        'signup': {
          templateUrl: 'app/auth/signup.html',
          controller: 'AuthController'
        },
        'signin': {
          templateUrl: 'app/auth/signin.html',
          controller: 'AuthController'
        }
      }})
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'app/progress/dashboard.html',
      controller: 'DashboardController'
    })

});