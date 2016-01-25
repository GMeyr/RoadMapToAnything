describe('DashboardController', function () {
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
      return $controller('DashboardController', {
        $scope: $scope
      });
    };

    createController();
  }));
//test followed maps
  it('should have a getFollowedMaps function', function () {
    expect($scope.getFollowed).to.be.a('function');
  });

  it('should get followed map data', function (){
    return $scope.getFollowedMaps()
      .then(function(){
        return Array.isArray($scope.followedMaps).should.be(true);
      });
  });

  it('should get followed map data with the right properties', function () {
    return $scope.getFollowedMaps()
      .then(function(){
        return $scope.followedMaps[0].title;
      });
  });
//test maps user made
  it('should have a getMyMaps function', function () {
    expect($scope.getMyMaps).to.be.a('function');
  });

    it('should get followed map data', function (){
    return $scope.getFollowedMaps()
      .then(function(){
        return Array.isArray($scope.followedMaps).should.be(true);
      });
  });

  it('should get followed map data with the right properties', function () {
    return $scope.getFollowedMaps()
      .then(function(){
        return typeof $scope.followedMaps[0].title === 'string';
      });
  });
});
