'use strict';

// Setting up route
angular.module('vis').config(['$stateProvider',
  function ($stateProvider) {
    // vis state routing
    $stateProvider
      .state('vis', {
        abstract: true,
        url: '/vis',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
        // templateUrl: 'modules/vis/client/views/default-vis.client.view.html'
      })
      .state('vis.default', {
        url: '/default',
        templateUrl: 'modules/vis/client/views/default-vis.client.view.html'
      })
      .state('vis.scatterplot', {
        url: '',
        templateUrl: 'modules/vis/client/views/scatterplot-vis.client.view.html'
      });
  }
]);
