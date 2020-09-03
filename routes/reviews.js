const express = require("express");
const router = express.Router();
const database = require("../database");
const { authenticate } = require("../helper");

module.exports = () => {
  //GET REVIEWS FOR SPECIFIC USER
  router.get("/user", authenticate, (req, res) => {
    console.log("Getting reviews for a  user");
    const user = req.user.id;
    database
      .getReviewsForSingleUser(user)
      .then((data) => res.send({ data }))
      .catch((err) => console.log("Error fetching reviews for user", err));
  });

  //GET REVIEWS FOR SPECIFIC BEER
  router.get("/beers/:id", (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    database
      .getReviewsForSingleBeer(req.params.id)
      .then((data) => res.send(data))
      // {
      //   if (endIndex < data.length) {
      //     results.next = {
      //       page: page + 1,
      //       limit: limit,
      //     };
      //   }

      //   results.results = data.slice(startIndex, endIndex);
      //   res.send(results);
      // })
      .catch((err) => console.log(err));
  });

  //CREATE REVIEW
  router.post("/", authenticate, (req, res) => {
    console.log("Creating a review");
    const review = req.body;
    review.user_id = req.user.id;
    database.createReview(review).then((data) => res.send({ data }));
  });

  //DELETE A REVIEW
  router.delete("/:id", authenticate, (req, res) => {
    console.log("Deleting a review");
    if (req.user) {
      database
        .deleteReview(req.params.id)
        .then((data) => res.send({ data }))
        .catch((err) => {
          console.log("err: ", err);
          res.status(500);
        });
    }
  });

  return router;
};
