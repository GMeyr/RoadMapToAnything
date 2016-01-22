describe('MainController', function () {

  beforeEach(inject(function ($rootScope){
    $scope = $rootScope.new();
  }));

  it('can be instantiated', inject(function($controller) {
    var controller = $controller('MainController', {
      $scope: $scope
    });

    expect(controller).not.toBeNull();
  }));

});
