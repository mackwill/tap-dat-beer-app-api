const express = require("express");
const router = express.Router();
const database = require("../database");
const helper = require("../helper");
const { authenticate } = require("../helper");

module.exports = () => {
  //GET WISHLISTS FOR A SPECIFIC USER
  router.get("/", authenticate, (req, res) => {
    console.log("Getting wishlists for a user");
    database
      .getWishListByUserId(req.user.id)
      .then((data) => res.send({ data }));
  });

  //CREATE A WISH FOR A USER
  router.post("/", authenticate, (req, res) => {
    console.log("Creating a wish");
    database
      .addToWishlist(req.body.beer_id, req.body.user_id)
      .then((data) => res.send({ data }));
  });

  //DELETE A WISH
  router.post("/delete", authenticate, (req, res) => {
    console.log("Deleting a wish");
    database
      .deleteFromWishlist(req.body.beer_id, req.body.user_id)
      .then((data) => res.send({ data }))
      .catch((err) => {
        console.log("err: ", err);
        res.status(500);
      });
  });

  return router;
};
