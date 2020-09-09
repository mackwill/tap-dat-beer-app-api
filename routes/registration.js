const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const database = require("../database");
const { authenticate } = require("../helper");
const jwt = require("jsonwebtoken");

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
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        req.session.token = accessToken;
        // req.session.user = user;
        // res.json({ user, accessToken });
        // res.status(200);

        const origin = [
          "https://serene-visvesvaraya-fd9028.netlify.app",
          "http://localhost:3002",
        ];

        res.setHeader("Access-Control-Allow-Origin", origin);
        res.header(
          "Access-Control-Allow-Methods",
          "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        );
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        res.header("Access-Control-Allow-Credentials", "true");

        res.send({ user, accessToken });
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
