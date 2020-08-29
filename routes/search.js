const express = require("express");
const router = express.Router();
const database = require("../database");

module.exports = () => {
  router.get("/", (req, res) => {
    if (req.query.q.length < 3) {
      res.send();
    } else {
      database.searchForBeers(req.query.q).then((data) => {
        res.send({ data });
      });
    }
  });

  return router;
};
