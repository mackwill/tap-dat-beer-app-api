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

  //CREATE REVIEW
  router.post("/", authenticate, (req, res) => {
    console.log("Creating a review");
    const review = req.body;
    review.user_id = req.user.id;
    database.createReview(review).then((data) => res.send({ data }));
  });

  //EDIT A REVIEW
  router.put("/:id", authenticate, (req, res) => {
    console.log("Editing a review", req.user, req.params.id, req.body);
    if(req.params.id !== req.body.id) {
      console.log('this is not good');
      res.status(400).send('review id must match body id')
      return;
    }
    if (req.user && req.user.id === req.body.user_id) {
      database  
        .editReview(req.params.id, req.body)
        .then((data) => res.send({ data }))
        .catch((err) => {
          console.log("err: ", err);
          res.status(500).send('database failure during an edit review')
        });
    } else {
      console.log('user id does not match:', req.user.id, req.body.user_id);
      res.status(403).send('invalid user or user id')
    }
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
