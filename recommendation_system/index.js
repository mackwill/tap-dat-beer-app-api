// const cron = require("node-cron");
// cron.schedule("* * * * *", function () {});

const database = require("../database");

database.getAllRatings().then((ratings) => {
  console.log(ratings);
});
