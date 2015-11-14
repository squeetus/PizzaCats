'use strict';

//Vis service used for communicating with the notes REST endpoints
angular.module('vis').factory('Vis', ['$resource',
  function ($resource) {
    return $resource('api/notes/users/:userId', {
      userId: '@_id'
    });
  }
]);
