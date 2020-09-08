const express = require("express");
const router = express.Router();
const database = require("../database");
const { authenticate } = require("../helper");

module.exports = () => {
  //GET REVIEWS FOR SPECIFIC USER
  router.get("/user", authenticate, (req, res) => {
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

    database
      .getReviewsForSingleBeer(req.params.id)
      .then((data) => res.send(data))
      .catch((err) => console.log(err));
  });

  //CREATE REVIEW
  router.post("/", authenticate, (req, res) => {
    const review = req.body;
    review.user_id = req.user.id;
    database.createReview(review).then((data) => res.send({ data }));
  });

  //EDIT A REVIEW
  router.put("/:id", authenticate, (req, res) => {
    if (req.params.id != req.body.id) {
      res.status(400).send("review id must match body id");
      return;
    }
    if (req.user && req.user.id === req.body.user_id) {
      database
        .editReview(req.params.id, req.body)
        .then((data) => res.send({ data }))
        .catch((err) => {
          console.log("err: ", err);
          res.status(500).send("database failure during an edit review");
        });
    } else {
      res.status(403).send("invalid user or user id");
    }
  });

  //DELETE A REVIEW
  router.delete("/:id", authenticate, (req, res) => {
    if (req.user) {
      database
        .deleteReview(req.params.id)
        .then((data) => res.send({ data }))
        .catch((err) => {
          res.status(500);
        });
    }
  });

  return router;
};
