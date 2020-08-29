const express = require("express");
const router = express.Router();
const database = require("../database");

module.exports = () => {
  router.get("/", (req, res) => {});

  return router;
};
