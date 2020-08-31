const express = require("express");
const router = express.Router();
const database = require("../database");
const jwt = require("jsonwebtoken");

//AUTHENTICATE MIDDLEWARE FOR THE JSONWEBTOKEN
function authenticate(req, res, next) {
  console.log(req.session.token);
  const token = req.session.token;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
  });
  next();
}

module.exports = () => {
  //GET ALL THE BEERS
  router.get("/", (req, res) => {
    if (req.session) {
      console.log("get back cookie:", req.session.token);
    }
    database.getBeers().then((data) => res.send({ data }));
  });

  router.get("/recommendations", authenticate, (req, res) => {
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
