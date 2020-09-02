const express = require("express");
const router = express.Router();
const database = require("../database");
const { authenticate } = require("../helper");

module.exports = () => {
  //CREATE A NEW NOTE, IF NOTE EXIST  UPDATE IT
  router.post("/", authenticate, (req, res) => {
    console.log("Creating a new note, or updating one");
    const note = req.body;
    note.user_id = req.user.id;
    database.getNote(req.user.id, req.body.beer_id).then((existingNote) => {
      if (existingNote) {
        database.updateNote(note).then((data) => res.send({ data }));
      } else {
        database.addNote(note).then((data) => res.send({ data }));
      }
    });
  });

  //GET A NOTE FOR SPECIFIC USER
  router.get("/:id", authenticate, (req, res) => {
    console.log("Getting a specific note");
    if (!req.user) {
      res.send();
    } else {
      database
        .getNote(req.user.id, req.params.id)
        .then((data) => res.send({ data }));
    }
  });

  return router;
};
