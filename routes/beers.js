const express = require("express");
const router = express.Router();
const database = require("../database");
const { authenticate } = require("../helper");
const { getUnique } = require("../helper");

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

  //GET RECENTLY SEEN BEERS
  router.get("/recently", authenticate, (req, res) => {
    console.log("Pulling recently viewed");
    if (!req.user) res.send();
    database
      .getRecentlyViewedForUser(req.user.id)
      .then((recentlyViewedBeers) => {
        const data = getUnique(recentlyViewedBeers, "id");
        res.send({ data });
      });
  });

  //GET A SPECIFIC BEER AND REVIEWS RELATED TO THAT BEER
  router.get("/:id", (req, res) => {
    console.log("Getting a specific beer and its reviews", req.params.id);
    let singleBeer = {};
    database
      .getASingleBeer(req.params.id)
      .then((data) => {
        console.log("data", data);
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

  router.get("/top10rated", (req, res) => {
    database.getTop10Beers().then((data) => res.send({ data }));
  });

  router.get("/top10reviewed", (req, res) => {
    database.getTop10Reviewed().then((data) => res.send({ data }));
  });

  router.get("/categories", (req, res) => {
    database.getBeerCategories().then((data) => res.send({ data }));
  });

  return router;
};
