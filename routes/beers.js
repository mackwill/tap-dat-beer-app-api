const express = require("express");
const router = express.Router();
const database = require("../database");

module.exports = () => {
  //GET ALL THE BEERS
  router.get("/", (req, res) => {
    database.getBeers().then((data) => res.send({ data }));
  });

  //GET A SPECIFIC BEER
  router.get("/:id", (req, res) => {
    database.getASingleBeer(req.params.id).then((data) => res.send({ data }));
  });

  return router;
};
