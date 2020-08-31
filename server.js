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
const cron = require("node-cron");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

module.exports = db;

const database = require("./database");
const engine = require("./recommendation_system/index");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 60 * 60 * 1000 * 1,
  })
);

cron.schedule("* 23 * * *", function () {
  console.log("Engine running...");
  engine.recommendationEngine();
});

// Separated Routes for each Resource
const registrationRoutes = require("./routes/registration");
const beersRoutes = require("./routes/beers");
const searchRoutes = require("./routes/search");
const otherRoutes = require("./routes/other");
const wishlistsRoutes = require("./routes/wishlists");

// Mount all resource routes
app.use("/api", registrationRoutes());
app.use("/api/beers", beersRoutes());
app.use("/search", searchRoutes());
app.use("/other", otherRoutes());
app.use("/wishlists", wishlistsRoutes());

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
