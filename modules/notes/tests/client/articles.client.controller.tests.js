'use strict';

(function () {
  // Notes Controller Spec
  describe('Notes Controller Tests', function () {
    // Initialize global variables
    var NotesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Notes,
      mockNote;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Notes_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Notes = _Notes_;

      // create mock note
      mockNote = new Notes({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Note about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Notes controller.
      NotesController = $controller('NotesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one note object fetched from XHR', inject(function (Notes) {
      // Create a sample notes array that includes the new note
      var sampleNotes = [mockNote];

      // Set GET response
      $httpBackend.expectGET('api/notes').respond(sampleNotes);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.notes).toEqualData(sampleNotes);
    }));

    it('$scope.findOne() should create an array with one note object fetched from XHR using a noteId URL parameter', inject(function (Notes) {
      // Set the URL parameter
      $stateParams.noteId = mockNote._id;

      // Set GET response
      $httpBackend.expectGET(/api\/notes\/([0-9a-fA-F]{24})$/).respond(mockNote);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.note).toEqualData(mockNote);
    }));

    describe('$scope.create()', function () {
      var sampleNotePostData;

      beforeEach(function () {
        // Create a sample note object
        sampleNotePostData = new Notes({
          title: 'An Note about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Note about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Notes) {
        // Set POST response
        $httpBackend.expectPOST('api/notes', sampleNotePostData).respond(mockNote);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the note was created
        expect($location.path.calls.mostRecent().args[0]).toBe('notes/' + mockNote._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/notes', sampleNotePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock note in scope
        scope.note = mockNote;
      });

      it('should update a valid note', inject(function (Notes) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/notes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/notes/' + mockNote._id);
      }));

      it('should set scope.error to error response message', inject(function (Notes) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/notes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(note)', function () {
      beforeEach(function () {
        // Create new notes array and include the note
        scope.notes = [mockNote, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/notes\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockNote);
      });

      it('should send a DELETE request with a valid noteId and remove the note from the scope', inject(function (Notes) {
        expect(scope.notes.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.note = mockNote;

        $httpBackend.expectDELETE(/api\/notes\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to notes', function () {
        expect($location.path).toHaveBeenCalledWith('notes');
      });
    });
  });
}());
