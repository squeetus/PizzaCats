'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Note = mongoose.model('Note'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, note;

/**
 * Note routes tests
 */
describe('Note CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new note
    user.save(function () {
      note = {
        title: 'Note Title',
        content: 'Note Content'
      };

      done();
    });
  });

  it('should be able to save an note if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new note
        agent.post('/api/notes')
          .send(note)
          .expect(200)
          .end(function (noteSaveErr, noteSaveRes) {
            // Handle note save error
            if (noteSaveErr) {
              return done(noteSaveErr);
            }

            // Get a list of notes
            agent.get('/api/notes')
              .end(function (notesGetErr, notesGetRes) {
                // Handle note save error
                if (notesGetErr) {
                  return done(notesGetErr);
                }

                // Get notes list
                var notes = notesGetRes.body;

                // Set assertions
                (notes[0].user._id).should.equal(userId);
                (notes[0].title).should.match('Note Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an note if not logged in', function (done) {
    agent.post('/api/notes')
      .send(note)
      .expect(403)
      .end(function (noteSaveErr, noteSaveRes) {
        // Call the assertion callback
        done(noteSaveErr);
      });
  });

  it('should not be able to save an note if no title is provided', function (done) {
    // Invalidate title field
    note.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new note
        agent.post('/api/notes')
          .send(note)
          .expect(400)
          .end(function (noteSaveErr, noteSaveRes) {
            // Set message assertion
            (noteSaveRes.body.message).should.match('Title cannot be blank');

            // Handle note save error
            done(noteSaveErr);
          });
      });
  });

  it('should be able to update an note if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new note
        agent.post('/api/notes')
          .send(note)
          .expect(200)
          .end(function (noteSaveErr, noteSaveRes) {
            // Handle note save error
            if (noteSaveErr) {
              return done(noteSaveErr);
            }

            // Update note title
            note.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing note
            agent.put('/api/notes/' + noteSaveRes.body._id)
              .send(note)
              .expect(200)
              .end(function (noteUpdateErr, noteUpdateRes) {
                // Handle note update error
                if (noteUpdateErr) {
                  return done(noteUpdateErr);
                }

                // Set assertions
                (noteUpdateRes.body._id).should.equal(noteSaveRes.body._id);
                (noteUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of notes if not signed in', function (done) {
    // Create new note model instance
    var noteObj = new Note(note);

    // Save the note
    noteObj.save(function () {
      // Request notes
      request(app).get('/api/notes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single note if not signed in', function (done) {
    // Create new note model instance
    var noteObj = new Note(note);

    // Save the note
    noteObj.save(function () {
      request(app).get('/api/notes/' + noteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', note.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single note with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/notes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Note is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single note which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent note
    request(app).get('/api/notes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No note with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an note if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new note
        agent.post('/api/notes')
          .send(note)
          .expect(200)
          .end(function (noteSaveErr, noteSaveRes) {
            // Handle note save error
            if (noteSaveErr) {
              return done(noteSaveErr);
            }

            // Delete an existing note
            agent.delete('/api/notes/' + noteSaveRes.body._id)
              .send(note)
              .expect(200)
              .end(function (noteDeleteErr, noteDeleteRes) {
                // Handle note error error
                if (noteDeleteErr) {
                  return done(noteDeleteErr);
                }

                // Set assertions
                (noteDeleteRes.body._id).should.equal(noteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an note if not signed in', function (done) {
    // Set note user
    note.user = user;

    // Create new note model instance
    var noteObj = new Note(note);

    // Save the note
    noteObj.save(function () {
      // Try deleting note
      request(app).delete('/api/notes/' + noteObj._id)
        .expect(403)
        .end(function (noteDeleteErr, noteDeleteRes) {
          // Set message assertion
          (noteDeleteRes.body.message).should.match('User is not authorized');

          // Handle note error error
          done(noteDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Note.remove().exec(done);
    });
  });
});
