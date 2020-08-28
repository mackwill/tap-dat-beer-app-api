// const cron = require("node-cron");
// cron.schedule("* * * * *", function () {});

const database = require("../database");
const db = require("../server");

database.getAllRatings().then((ratings) => {
  function transformDataToTable(data) {
    const ratings_to_table = {};
    ratings.forEach((elm) => {
      if (!ratings_to_table[elm.user_id]) {
        ratings_to_table[elm.user_id] = {};
        ratings_to_table[elm.user_id][elm.beer_id] = elm.rating;
      } else {
        ratings_to_table[elm.user_id][elm.beer_id] = elm.rating;
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

  database.getAllUsers().then(users);
  users.forEach((user) => {
    db.query(`
    DELETE * FROM recommendations
    WHERE id = user.id
    `);
    findSuggestedBeer(find3ClosestNeighbour(user.id)).forEach((elm) => {
      db.query(`
    INSERT INTO recommendations (user_id, beer_id)
    VALUES (${user.id}, ${elm.beer_id})
    `);
    });
  });
});