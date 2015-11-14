'use strict';

// vis controller
angular.module('vis').controller('VisController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vis',
  function ($scope, $stateParams, $location, Authentication, Vis) {
    $scope.authentication = Authentication;

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // // Find a list of notes
    // $scope.find = function () {
    //   $scope.notes = Vis.query();
    // };

    // Find existing notes for a user
    $scope.findByUser = function () {
      if(!Authentication.user._id) {
        $location.url('/forbidden');
      }
      $scope.notes = Vis.query({
        userId: Authentication.user._id
      });
      $scope.notes.$promise.then(function(data){

          $scope.notes = data;
          $scope.$broadcast("Data_Ready");
      });
    };
  }
]);
