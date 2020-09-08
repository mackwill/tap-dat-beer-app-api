const express = require("express");
const router = express.Router();
const database = require("../database");
const { authenticate, getSimilarBeers, getUnique } = require("../helper");

module.exports = () => {
  router.get("/top10rated", (req, res) => {
    database.getTop10Beers().then((data) => {
      res.status(200);
      res.send({ data });
    });
  });

  router.get("/top10reviewed", (req, res) => {
    database.getTop10Reviewed().then((data) => {
      res.send({ data });
    });
  });

  router.get("/categories", (req, res) => {
    database.getBeerCategories().then((data) => res.send({ data }));
  });

  router.get("/similar/:id", async (req, res) => {
    const beers = await database.getBeers();
    const singleBeer = await database.getASingleBeer(req.params.id);
    const data = getSimilarBeers(singleBeer, beers);
    res.send({ data });
  });

  //GET ALL THE BEERS
  router.get("/", (req, res) => {
    database.getBeers().then((data) => res.send({ data }));
  });

  //GET RECOMMENDATION FOR SPECIFIC USER
  router.get("/recommendations", authenticate, (req, res) => {
    const userId = req.user.id;
    database
      .getRecommendationsForUser(userId)
      .then((data) => res.send({ data }));
  });

  //GET RECENTLY SEEN BEERS
  router.get("/recently", authenticate, (req, res) => {
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
      });
  });

  return router;
};
