'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Note = mongoose.model('Note'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a note
 */
// exports.create = function (req, res) {
//   var note = new Note(req.body);
//   note.user = req.user;
//
//   note.save(function (err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(note);
//     }
//   });
// };
//
// /**
//  * Show the current note
//  */
// exports.read = function (req, res) {
//   res.json(req.note);
// };
//
// /**
//  * Update a note
//  */
// exports.update = function (req, res) {
//   var note = req.note;
//
//   note.title = req.body.title;
//   note.content = req.body.content;
//
//   note.save(function (err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(note);
//     }
//   });
// };
//
// /**
//  * Delete an note
//  */
// exports.delete = function (req, res) {
//   var note = req.note;
//
//   note.remove(function (err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(note);
//     }
//   });
// };
//
// /**
//  * List of Notes
//  */
// exports.list = function (req, res) {
//   Note.find().sort('-created').populate('user', 'displayName').exec(function (err, notes) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(notes);
//     }
//   });
// };
//
// /**
//  * Note middleware
//  */
// exports.noteByID = function (req, res, next, id) {
//
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).send({
//       message: 'Note is invalid'
//     });
//   }
//
//   Note.findById(id).populate('user', 'displayName').exec(function (err, note) {
//     if (err) {
//       return next(err);
//     } else if (!note) {
//       return res.status(404).send({
//         message: 'No note with that identifier has been found'
//       });
//     }
//     req.note = note;
//     next();
//   });
// };

/**
 * Note middleware
 */
exports.noteByUser = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User id is invalid'
    });
  }

  Note.find({
    user: {_id: req.params.userId }
  }).exec(function (err, notes) {
    if (err) {
      return next(err);
    } else if (!notes || notes.length === 0) {
      return res.status(404).send({
        message: 'No notes have been found for the specified user'
      });
    }
    req.notes = notes;
    next();
  });
};
