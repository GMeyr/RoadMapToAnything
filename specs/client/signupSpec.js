describe('AuthController', function () {
  var $scope, $rootScope, $location, createController, $httpBackend;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $location = $injector.get('$location');

    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('AuthController', {
        $scope: $scope
      });
    };

    createController();
  }));

  it('should have an attemptSignup function', function () {
    expect($scope.attemptSignup).to.be.a('function');
  });

  it('should have a username on the model', function () {
    expect($scope.attemptedFirstName).to.equal("not yet set");
  });

  it('should have a password on the model', function () {
    expect($scope.attemptedLastName).to.equal("not yet set");
  });

  it('should have a username on the model', function () {
    expect($scope.attemptedUsername).to.equal("not yet set");
  });

  it('should have a password on the model', function () {
    expect($scope.attemptedPassword).to.equal("not yet set");
  });
  
  it('should not start out showing msg about bad credentials', function (){
    expect($scope.showUnauthMsg).to.be.false;
  });

});