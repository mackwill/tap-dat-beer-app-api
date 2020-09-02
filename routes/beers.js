const express = require("express");
const router = express.Router();
const database = require("../database");
const { authenticate } = require("../helper");

module.exports = () => {
  //GET ALL THE BEERS
  router.get("/", (req, res) => {
    console.log("Getting all the beers");
    database.getBeers().then((data) => res.send({ data }));
  });

  //GET RECOMMENDATION FOR SPECIFIC USER
  router.get("/recommendations", authenticate, (req, res) => {
    console.log("Getting beers recommendations");
    const userId = req.user.id;
    database
      .getRecommendationsForUser(userId)
      .then((data) => res.send({ data }));
  });

  //GET A SPECIFIC BEER AND REVIEWS RELATED TO THAT BEER
  router.get("/:id", (req, res) => {
    console.log("Getting a specific beer and its reviews");
    let singleBeer = {};
    database
      .getASingleBeer(req.params.id)
      .then((data) => {
        singleBeer = { ...data };
        return database.getReviewsForSingleBeer(data.id);
      })
      .then((reviews) => {
        res.send({
          beer: singleBeer,
          reviews: reviews,
        });
      })
      .catch((err) => {
        res.status(500);
        console.log("Error: ", err);
      });
  });

  return router;
};
