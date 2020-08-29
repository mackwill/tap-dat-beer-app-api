const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const database = require("../database");
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

//AUTHENTICATE MIDDLEWARE FOR THE JSONWEBTOKEN
function authenticate(req, res, next) {
  console.log(req.session.token);
  const token = req.session.ACCESS_TOKEN_SECRET;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token.process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = () => {
  //LOGIN A USER
  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    login(email, password)
      .then((user) => {
        if (!user) {
          console.log("sorry");
          res.send("didnt work");
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
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    database.getUserWithEmail(user.email).then((existingUser) => {
      if (existingUser) {
        res.send();
      } else {
        database
          .addUser(user)
          .then((user) => {
            console.log("made it here:", user);
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
              //res.send(user)
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
    req.session.token = null;
    res.send("Logout successful");
  });

  return router;
};
