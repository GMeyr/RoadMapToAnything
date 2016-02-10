angular.module('browse.factory', ['services.server'])
.factory('Browse', ['Server', function(Server){

  var mapData =[];
  var showSigninMsg = false;

  var addTotalNodesOfMaps = function (arr){
    arr.forEach(function(map){
      map.totalNodes = map.nodes.length;
    });
  };

  var getMapData = function(cb){
    var mapData = Server.getRoadmaps({sort: '-bestRating'})
    .then(function(data){
      addTotalNodesOfMaps(data);
      console.log(data);
      cb(data);
    });
  };

  var orderMaps = function(mapData, criteria){
    if (!criteria){
      criteria = 'created'
    }
    return mapData[criteria]
    
  }

  return {
    addTotalNodesOfMaps: addTotalNodesOfMaps,
    getMapData: getMapData,
    orderMaps: orderMaps
  };
  

}]);
