const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const database = require("../database");
const { authenticate } = require("../helper");
const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");
const s3 = new aws.S3({ secretAccessKey: process.env.ACCESS_TOKEN_SECRET });

//LOGIN HELPER
const login = function (email, password) {
  return database
    .getUserWithEmail(email)
    .then((user) => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      throw new Error("Invalid password");
    })
    .catch((err) => {
      res.status(500);
      res.send("Invalid Login");
    });
};

module.exports = () => {
  //GET USER INFORMATION
  router.get("/user", authenticate, (req, res) => {
    if (req.user) {
      database
        .getUserById(req.user.id)
        .then((data) => res.json({ data }))
        .catch((e) => null);
    }
  });

  //UPDATE USER INFORMATION
  router.put("/user", authenticate, (req, res) => {
    const user = req.user;
    if (user) {
      database
        .updateUser(user.id, req.body)
        .then((data) => res.send({ data }))
        .catch((e) => null);
    } else {
      res.send((e) => null);
    }
  });

  //LOGIN A USER
  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    login(email, password)
      .then((user) => {
        if (!user) {
          throw new Error();
        }
        const accessToken = jwt.sign(user, s3.secretAccessKey);
        req.session.token = accessToken;
        res.json({ user, accessToken });
        res.status(200);
      })
      .catch(() => {
        res.status(500);
        res.send("Error logging in");
      });
  });

  //REGISTER/CREATE A USER
  router.post("/register", (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    database
      .getUserWithEmail(user.email)
      .then((existingUser) => {
        if (existingUser) {
          throw new Error("Email already exists");
        } else {
          database.addUser(user).then((user) => {
            if (!user) {
              throw new Error();
            } else {
              const accessToken = jwt.sign(
                user,
                process.env.ACCESS_TOKEN_SECRET
              );
              req.session.token = accessToken;
              res.json({ user, accessToken });
              res.status(200);
            }
          });
        }
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
        res.end();
      });
  });

  //LOGOUT A USER
  router.post("/logout", (req, res) => {
    req.session.token = null;
    res.send("Logout successful");
  });

  return router;
};
