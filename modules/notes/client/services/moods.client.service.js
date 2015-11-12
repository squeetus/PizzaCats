'use strict';

//Notes service used for communicating with the notes REST endpoints
angular.module('notes').factory('Moods', ['$resource',
  function ($resource) {
    return $resource('api/moods');
  }
]);
