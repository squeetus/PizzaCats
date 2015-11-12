'use strict';

/**
 * Module dependencies.
 */
var notesPolicy = require('../policies/notes.server.policy'),
  notes = require('../controllers/notes.server.controller');

module.exports = function (app) {

  // Notes unique moods
  app.route('/api/moods').all(notesPolicy.isAllowed)
    .get(notes.moods);

  // Notes collection routes
  app.route('/api/notes').all(notesPolicy.isAllowed)
    .get(notes.list)
    .post(notes.create);

  // Single note routes
  app.route('/api/notes/:noteId').all(notesPolicy.isAllowed)
    .get(notes.read)
    .put(notes.update)
    .delete(notes.delete);

  // Multiple note routes
  app.route('/api/notes/users/:userId').all(notesPolicy.isAllowed)
    .get(notes.readByUser);

  // Finish by binding the note middleware
  app.param('noteId', notes.noteByID);
  app.param('userId', notes.noteByUser);
};
