var twitter = angular.module('Twitter', ['ngResource', 'scroll']);
twitter.factory('twitterResource', function($resource){
  return $resource('http://search.twitter.com/:action',
    {action:'search.json', q:'angularjs', callback:'JSON_CALLBACK'},
    {get:{method:'JSONP'}});
});
angular.module('scroll', []).directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        console.log("1");
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
            	console.log("2");
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});
function TwitterCtrl($scope, twitterResource) {
  $scope.twitterResult = "";
  $scope.message 			 = "";
  $scope.twetts 			 = [];
  $scope.$watch('twitterResult.results', function(results){
  	if (results){
	  	$scope.since_id = $scope.twitterResult.max_id;
	  	if ($scope.twetts.length == 0){
	  		angular.copy(results, $scope.twetts);	
	  	}else{
	  		angular.forEach(results, function(twett){
	  			$scope.twetts.push(twett);
	  		})
	  	}
  	}
  	$scope.message = "";
  });
  $scope.doSearch = function () {
    $scope.loadMore();
  };
  $scope.loadMore = function(){ 
  	$scope.message = "Loading...";
  	$scope.twitterResult = twitterResource.get({q:$scope.searchTerm, rpp: '5', since_id: $scope.since_id || 0});
  };
}
