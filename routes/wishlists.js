const express = require("express");
const router = express.Router();
const database = require("../database");
const helper = require("../helper");
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
  router.get("/", authenticate, (req, res) => {
    database
      .getWishListByUserId(req.user.id)
      .then((data) => res.send({ data }));
  });

  router.post("/", authenticate, (req, res) => {
    const wish = { beer_id: req.body.beer_id, user_id: req.user.id };
    database.addToWishlist(wish).then((data) => res.send({ data }));
  });

  return router;
};
