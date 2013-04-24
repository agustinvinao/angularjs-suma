'use strict';
angular.module('Twitter', ['Twitter.services', 'scroll', 'Twitter.components', 'Twitter.controllers'])

angular.module('scroll', [])
  .directive('whenScrolled', function() {
    return function(scope, elm, attr) {
      var raw = elm[0];
      elm.bind('scroll', function() {
        if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
          scope.$apply(attr.whenScrolled);
        }
      });
    };
  });
angular.module('Twitter.components', [])
  .directive('tweetDetail', function() {
    return {
      restrict: "E",
      transclude: false,
      scope: {
        tweetUser: '@',
        tweetText: '@',
        tweetDate: '@',
        tweetImg: '@'
      },
      template: '<img ng-src="{{tweetImg}}"><div class="tweet-detail"><div class="tweet-user">{{tweetUser}}</div><div class="tweet-text">{{tweetText}}</div><div class="tweet-date">{{tweetImg | date:"medium" }}</div></div>'
    } 
  });

angular.module('Twitter.services', ['ngResource']).
  factory('twitterResource', ['$resource', function($resource){
    return $resource('http://search.twitter.com/:action',
      {action:'search.json', q:'angularjs', callback:'JSON_CALLBACK'},
      {get:{method:'JSONP'}});
  }]);

angular.module('Twitter.controllers', []).
  controller('TwitterCtrl', ['$scope', 'twitterResource', function($scope, twitterResource){
    $scope.twitterResult  = "";
    $scope.message        = "";
    $scope.twetts         = [];
    $scope.page           = 1;
    
    $scope.$watch('twitterResult.results', function(resultsOld, resultsNew){
      if ($scope.twitterResult.results){
        $scope.page += 1;
        angular.forEach($scope.twitterResult.results, function(twett){
          $scope.twetts.push(twett);
        })
      }
      $scope.message = "";
    });
    $scope.doSearch = function () {
      $scope.twetts = [];
      $scope.loadMore();
    };
    $scope.loadMore = function(){ 
     $scope.message = "Loading...";
     $scope.twitterResult = twitterResource.get({q:$scope.searchTerm, rpp: '10', page: $scope.page});
    };
  }]);