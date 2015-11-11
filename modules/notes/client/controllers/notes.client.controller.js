'use strict';

// notes controller
angular.module('notes').controller('NotesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notes',
  function ($scope, $stateParams, $location, Authentication, Notes) {
    $scope.authentication = Authentication;

    // Create new note
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'noteForm');

        return false;
      }

      // Create new note object
      var note = new Notes({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      note.$save(function (response) {
        $location.path('notes/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing note
    $scope.remove = function (note) {
      if (note) {
        note.$remove();

        for (var i in $scope.notes) {
          if ($scope.notes[i] === note) {
            $scope.notes.splice(i, 1);
          }
        }
      } else {
        $scope.note.$remove(function () {
          $location.path('notes');
        });
      }
    };

    // Update existing note
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'noteForm');

        return false;
      }

      var note = $scope.note;

      note.$update(function () {
        $location.path('notes/' + note._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of notes
    $scope.find = function () {
      $scope.notes = Notes.query();
    };

    // Find existing note
    $scope.findOne = function () {
      $scope.note = Notes.get({
        noteId: $stateParams.noteId
      });
    };
  }
]);
