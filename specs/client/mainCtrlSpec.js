describe('MainController', function () {
  beforeEach(module('app.main'));
  var scope;
  var MainController;

  describe('test()', function(){
    it('should have a test fn property', inject(function($controller, $rootScope){
      scope = $rootScope.$new();
      MainController = $controller('MainController', {
        $scope: scope
      });

      MainController.test().should.equal('Main controller is working');
    }));

  });

});
