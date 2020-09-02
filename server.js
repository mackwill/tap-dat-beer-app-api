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
engine.recommendationEngine();
cron.schedule("* 23 * * *", function () {
  console.log("Engine running...");
  engine.recommendationEngine();
});

// Separated Routes for each Resource
const registrationRoutes = require("./routes/registration");
const beersRoutes = require("./routes/beers");
const searchRoutes = require("./routes/search");
const wishlistsRoutes = require("./routes/wishlists");
const reviewsRoutes = require("./routes/reviews");
const notesRoutes = require("./routes/notes");

// Mount all resource routes
app.use("/api", registrationRoutes());
app.use("/api/beers", beersRoutes());
app.use("/api/search", searchRoutes());
app.use("/api/wishlists", wishlistsRoutes());
app.use("/api/reviews", reviewsRoutes());
app.use("/api/notes", notesRoutes());

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
