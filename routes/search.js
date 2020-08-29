const express = require("express");
const router = express.Router();
const database = require("../database");

module.exports = () => {
  router.get("/", (req, res) => {
    database.searchForBeers(req.query).then((data) => res.send({ data }));
  });

  return router;
};
