const express = require("express");
const router = express.Router();
const database = require("../database");
const { returnTop10Searches } = require("../helper");

module.exports = () => {
  //GET BEERS WITH SEARCH QUERY
  router.get("/", (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    database
      .searchForBeers(req.query.q)
      .then((data) => {
        if (endIndex < data.length) {
          results.next = {
            page: page + 1,
            limit: limit,
          };
        }

        results.results = data.slice(startIndex, endIndex);
        res.send(results);
      })
      .catch((e) => null);
  });

  //CREATE A HISTORY ANALYTICS ROW
  router.post("/analytics", (req, res) => {
    database
      .newSearch(req.body)
      .then((data) => res.send(data))
      .catch((e) => res.send());
  });

  //GET TOP 10 SEARCHES
  router.get("/analytics", (req, res) => {
    database
      .getSearchAnalytics()
      .then((data) => {
        const finalData = returnTop10Searches(data);
        res.send({ finalData });
      })
      .catch((e) => res.send());
  });
  return router;
};
