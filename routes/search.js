const express = require("express");
const router = express.Router();
const database = require("../database");
const helper = require("../helper");

module.exports = () => {
  router.get("/", (req, res) => {
    if (req.query.q.length < 3) {
      res.send();
    } else {
      database.searchForBeers(req.query.q).then((data) => {
        res.send({ data });
      });
    }
  });

  router.post("/analytics", (req, res) => {
    database
      .newSearch(req.body)
      .then((data) => res.send(data))
      .catch((e) => res.send());
  });

  router.get("/analytics", (req, res) => {
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
