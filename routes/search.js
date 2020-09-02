const express = require("express");
const router = express.Router();
const database = require("../database");
const helper = require("../helper");

module.exports = () => {
  //GET BEERS WITH SEARCH QUERY
  router.get("/", (req, res) => {
    console.log("Getting beers from search query");
    if (req.query.q.length < 3) {
      res.send();
    } else {
      database.searchForBeers(req.query.q).then((data) => res.send({ data }));
    }
  });

  //CREATE A HISTORY ANALYTICS ROW
  router.post("/analytics", (req, res) => {
    console.log("Pushing to analytics");
    database
      .newSearch(req.body)
      .then((data) => res.send(data))
      .catch((e) => res.send());
  });

  //GET TOP 10 SEARCHES
  router.get("/analytics", (req, res) => {
    console.log("Getting top 10 searches");

    database
      .getSearchAnalytics()
      .then((data) => {
        const finalData = helper.returnTop10Searches(data);
        res.send({ finalData });
      })
      .catch((e) => res.send());
  });
  return router;
};
