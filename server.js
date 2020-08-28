// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 5001;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const app = express();

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

module.exports = db;

const database = require("./database");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 60 * 60 * 1000 * 1,
  })
);

// Separated Routes for each Resource
const registrationRoutes = require("./routes/registration");
// Mount all resource routes
app.use("/api", registrationRoutes());

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/beers", (req, res) => {
  database.getBeers().then((data) => res.send({ data }));
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
