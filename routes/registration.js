const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const database = require("../database");
const { authenticate } = require("../helper");
const jwt = require("jsonwebtoken");

//LOGIN HELPER
const login = function (email, password) {
  return database.getUserWithEmail(email).then((user) => {
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  });
};

module.exports = () => {
  //GET USER INFORMATION
  router.get("/user", authenticate, (req, res) => {
    console.log("Getting user information");
    if (req.user) {
      database
        .getUserById(req.user.id)
        .then((data) => res.json({ data }))
        .catch((e) => null);
    }
    res.send();
  });

  //UPDATE USER INFORMATION
  router.put("/user", authenticate, (req, res) => {
    console.log("Updating user information");
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
    console.log("Loging in user");
    const { email, password } = req.body;
    login(email, password)
      .then((user) => {
        if (!user) {
          res.send("Those credentials do not match our database");
        }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        req.session.token = accessToken;
        res.json({ user, accessToken });
        res.status(200);
      })
      .catch(() => {
        res.send();
      });
  });

  //REGISTER/CREATE A USER
  router.post("/register", (req, res) => {
    console.log("Creating a user");
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    database.getUserWithEmail(user.email).then((existingUser) => {
      if (existingUser) {
        res.send();
      } else {
        database
          .addUser(user)
          .then((user) => {
            if (!user) {
              res.send();
            } else {
              const accessToken = jwt.sign(
                user,
                process.env.ACCESS_TOKEN_SECRET
              );
              req.session.token = accessToken;
              res.json({ user, accessToken });
              res.status(200);
            }
          })
          .catch(() => {
            res.send("Username or password incorrect");
          });
      }
    });
  });

  //LOGOUT A USER
  router.post("/logout", (req, res) => {
    console.log("Loging out a user");
    req.session.token = null;
    res.send("Logout successful");
  });

  return router;
};
