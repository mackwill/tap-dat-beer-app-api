// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 5001;
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const app = express();
const cron = require("node-cron");
const cors = require("cors");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

module.exports = db;

const engine = require("./recommendation_system/index");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.set("trust proxy", 1);

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    // secureProxy: true,
    maxAge: 60 * 60 * 1000 * 1,
    httpOnly: false,
    secure: true,
  })
);
engine.recommendationEngine();
cron.schedule("* 23 * * *", function () {
  engine.recommendationEngine();
});

// Separated Routes for each Resource
const registrationRoutes = require("./routes/registration");
const beersRoutes = require("./routes/beers");
const searchRoutes = require("./routes/search");
const wishlistsRoutes = require("./routes/wishlists");
const reviewsRoutes = require("./routes/reviews");
const notesRoutes = require("./routes/Notes");

// Mount all resource routes
app.use("/api", registrationRoutes());
app.use("/api/beers", beersRoutes());
app.use("/api/search", searchRoutes());
app.use("/api/wishlists", wishlistsRoutes());
app.use("/api/reviews", reviewsRoutes());
app.use("/api/Notes", notesRoutes());

app.listen(PORT, () => {
  console.log("Server API listening on port " + PORT);
});
