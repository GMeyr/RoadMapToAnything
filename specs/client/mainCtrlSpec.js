describe('MainController', function () {
  var $scope, $rootScope, $location, createController, $httpBackend;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('app'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $location = $injector.get('$location');

    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('MainController', {
        $scope: $scope
      });
    };

    createController();
  }));

  it('should have a test method on the $scope', function () {
    expect($scope.test).to.be.a('function');
  });

});
