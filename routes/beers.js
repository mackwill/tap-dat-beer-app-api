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
        console.log("Error: ", err);
      });
  });

  return router;
};
