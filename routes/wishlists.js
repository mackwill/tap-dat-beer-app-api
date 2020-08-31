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
    console.log("wishlist post req:", req.body);
    const wish = { beer_id: req.body.beer_id, user_id: req.user.id };
    database.addToWishlist(req.body.beer_id, req.body.user_id).then((data) => {
      console.log("data: ", data);
      res.send({ data });
    });
  });

  router.post("/delete", authenticate, (req, res) => {
    console.log("delete req.body: ", req.body);
    database
      .deleteFromWishlist(req.body.beer_id, req.body.user_id)
      .then((data) => {
        console.log("data", data);
        res.send({ data });
      })
      .catch((err) => {
        console.log("err: ", err);
        res.status(500);
      });
  });

  return router;
};
