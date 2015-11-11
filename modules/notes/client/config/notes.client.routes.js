'use strict';

// Setting up route
angular.module('notes').config(['$stateProvider',
  function ($stateProvider) {
    // notes state routing
    $stateProvider
      .state('notes', {
        abstract: true,
        url: '/notes',
        template: '<ui-view/>'
      })
      .state('notes.list', {
        url: '',
        templateUrl: 'modules/notes/client/views/list-notes.client.view.html'
      })
      .state('notes.create', {
        url: '/create',
        templateUrl: 'modules/notes/client/views/create-note.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('notes.view', {
        url: '/:noteId',
        templateUrl: 'modules/notes/client/views/view-note.client.view.html'
      })
      .state('notes.edit', {
        url: '/:noteId/edit',
        templateUrl: 'modules/notes/client/views/edit-note.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
