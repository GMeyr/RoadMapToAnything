describe('BrowseController', function () {
  var $scope, $rootScope, createController;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');


    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('BrowseController', {
        $scope: $scope
      });
    };

    createController();
  }));


  it('should have a function to populate browse page', function (){
    expect($scope.getMapData).to.be.a('function');
  });

  it('should have a function to embark on a map', function (){
    expect($scope.addMapToEmbarked).to.be.a('function');
  });

  it('should have a function to go to dashboard', function (){
    expect($scope.goToDash).to.be.a('function');
  });

  it('should have a function to add up node totals', function (){
    expect($scope.addTotalNodesOfMaps).to.be.a('function');
  });






});