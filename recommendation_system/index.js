// const cron = require("node-cron");
// cron.schedule("* * * * *", function () {});
const express = require("express");
const router = express.Router();
const database = require("../database");
const db = require("../server");

module.exports = () => {
  router.get("/algo", async (req, res) => {
    const ratings = await database.getAllRatings();
    const users = await database.getAllUsers();

    function transformDataToTable(data) {
      const ratings_to_table = {};
      ratings.forEach((elm) => {
        if (!ratings_to_table[elm.user_id]) {
          ratings_to_table[elm.user_id] = {};
          ratings_to_table[elm.user_id][elm.beer_id] = elm.rank;
        } else {
          ratings_to_table[elm.user_id][elm.beer_id] = elm.rank;
        }
      });
      return ratings_to_table;
    }
    const ratings_to_table = transformDataToTable(ratings);

    //Helper: used by find3ClosestNeighbour
    function euclideanSimilarity(user, otherUser) {
      var user = user;
      var otherUser = otherUser;

      const ratedBeers_id = Object.keys(user);

      var sumSquares = 0;
      for (let i = 0; i < ratedBeers_id.length; i++) {
        const rating_user = user[ratedBeers_id[i]];
        const rating_other_user = otherUser[ratedBeers_id[i]];

        if (rating_user != null && rating_other_user != null) {
          const difference = rating_user - rating_other_user;

          sumSquares += difference * difference;
        }
      }
      var distance = Math.sqrt(sumSquares);
      var similarityScore = 1 / (distance + 1);
      return similarityScore;
    }

    //Get 3 closest neighbours
    function find3ClosestNeighbour(user) {
      const users = Object.keys(ratings_to_table);
      const stats = [];
      users.forEach((elm) => {
        stats.push({
          name: elm,
          distance: euclideanSimilarity(
            ratings_to_table[user],
            ratings_to_table[elm]
          ),
        });
      });
      function compare(a, b) {
        if (a.distance > b.distance) {
          return -1;
        }
        if (a.distance < b.distance) {
          return 1;
        }
        return 0;
      }
      const sortedStats = stats.sort(compare);
      return sortedStats.slice(1, 4);
    }

    //Helper: used by findSuggestedBeer
    function findUserRatingsByUserName(userName, x = Infinity) {
      const user_ratings = ratings_to_table[userName];
      var props = Object.keys(user_ratings).map(function (key) {
        return { beer_id: key };
      }, user_ratings);
      props.sort(function (p1, p2) {
        return p2.value - p1.value;
      });
      var topX = props.slice(0, x);
      return topX;
    }

    //Helper: used by findSuggestedBeer
    function getUnique(arr, comp) {
      const unique = arr
        .map((e) => e[comp])
        .map((e, i, final) => final.indexOf(e) === i && i)
        .filter((e) => arr[e])
        .map((e) => arr[e]);
      return unique;
    }

    //Neighbours => suggestedBeers
    function findSuggestedBeer(neighbours) {
      let topSuggestedBeer = [];

      neighbours.forEach((neighbour) => {
        topSuggestedBeer = [
          ...topSuggestedBeer,
          ...findUserRatingsByUserName(neighbour.name, 3),
        ];
      });
      return getUnique(topSuggestedBeer);
    }

    // console.log(
    //   "sugested beer:",
    //   findSuggestedBeer(find3ClosestNeighbour("5"))
    // );
    users.forEach(async (user) => {
      const user_id = user.id.toString();
      await database.deleteRecommendationByUserId(user_id);
    });
    const finalInsert = users.map((user) => {
      return `( ${find3ClosestNeighbour(user.id.toString())})`;
      //findSuggestedBeer(find3ClosestNeighbour(user.id.toString()))
    });
    console.log(finalInsert);
    // users.forEach(async (user) => {
    //   const user_id = user.id.toString();
    //   console.log("here:", user_id);
    //   const recommendations = findSuggestedBeer(find3ClosestNeighbour(user_id));
    //   recommendations.forEach((elm) => {
    //     const recommendation = {
    //       user_id: user_id,
    //       beer_id: elm.beer_id,
    //     };
    //     database.createRecommendation(recommendation);
    //   });
    // });
  });

  return router;
};
