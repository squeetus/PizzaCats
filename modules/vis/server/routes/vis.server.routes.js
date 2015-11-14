'use strict';

/**
 * Module dependencies.
 */
var visPolicy = require('../policies/vis.server.policy'),
  vis = require('../controllers/vis.server.controller');

module.exports = function (app) {
  // Notes collection routes
  // app.route('/api/notes').all(notesPolicy.isAllowed)
  //   .get(notes.list)
  //   .post(notes.create);
  //
  // // Single note routes
  // app.route('/api/notes/:noteId').all(notesPolicy.isAllowed)
  //   .get(notes.read)
  //   .put(notes.update)
  //   .delete(notes.delete);
  //
  // // Finish by binding the note middleware
  // app.param('noteId', notes.noteByID);
};
