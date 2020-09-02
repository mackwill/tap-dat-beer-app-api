const express = require("express");
const router = express.Router();
const database = require("../database");
const { authenticate } = require("../helper");

module.exports = () => {
  //GET ALL THE BEERS
  router.get("/recently", authenticate, (req, res) => {
    console.log("Pulling recently viewed");
    if (!req.user) res.send();
    database
      .getRecentlyViewedForUser(req.user.id)
      .then((data) => res.send({ data }));
  });

  return router;
};
