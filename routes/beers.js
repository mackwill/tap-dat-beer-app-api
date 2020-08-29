const express = require("express");
const router = express.Router();
const database = require("../database");

module.exports = () => {
  //GET ALL THE BEERS
  router.get("/", (req, res) => {
    if (req.session) {
      console.log("get back cookie:", req.session.token);
    }
    database.getBeers().then((data) => res.send({ data }));
  });

  router.get("/recommendations", (req, res) => {
    const userId = req.session.userid;
    database
      .getRecommendationsForUser(userId)
      .then((data) => res.send({ data }));
  });

  //GET A SPECIFIC BEER
  router.get("/:id", (req, res) => {
    database.getASingleBeer(req.params.id).then((data) => res.send({ data }));
  });

  return router;
};
