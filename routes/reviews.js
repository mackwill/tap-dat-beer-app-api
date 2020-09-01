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
  // Get reviews for a single user
  router.get("/user", authenticate, (req, res) => {
    const user = req.user.id;

    database
      .getReviewsForSingleUser(user)
      .then((data) => res.send({ data }))
      .catch((err) => console.log("Error fetching reviews for user", err));
  });

  //GET ALL THE BEERS
  router.post("/", authenticate, (req, res) => {
    const review = req.body;
    review.user_id = req.user.id;
    console.log("Creating a review:", review);

    database.createReview(review).then((data) => res.send({ data }));
  });

  return router;
};
