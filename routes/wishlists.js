const express = require("express");
const router = express.Router();
const database = require("../database");
const { authenticate } = require("../helper");

module.exports = () => {
  //GET WISHLISTS FOR A SPECIFIC USER
  router.get("/", authenticate, (req, res) => {
    database
      .getWishListByUserId(req.user.id)
      .then((data) => res.send({ data }));
  });

  //CREATE A WISH FOR A USER
  router.post("/", authenticate, (req, res) => {
    database
      .addToWishlist(req.body.beer_id, req.body.user_id)
      .then((data) => res.send({ data }));
  });

  //DELETE A WISH
  router.delete("/:id", authenticate, (req, res) => {
    if (req.user) {
      database
        .deleteFromWishlist(req.params.id)
        .then((data) => res.send({ data }))
        .catch((err) => {
          res.status(500);
        });
    }
  });

  return router;
};
