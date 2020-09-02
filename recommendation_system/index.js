const database = require("../database");
const db = require("../server");
const {
  transformDataToTable,
  getUsersFromRatings,
  findSuggestedBeer,
  find3ClosestNeighbour,
} = require("./helpers");

const recommendationEngine = async () => {
  const ratings = await database.getAllRatings();
  const users = getUsersFromRatings(ratings);
  const ratings_to_table = transformDataToTable(ratings);

  let finalInsert = "";
  users.forEach((user, index) => {
    if (index === users.length - 1) {
      finalInsert += `( ${user.user_id}, ${
        findSuggestedBeer(
          find3ClosestNeighbour(user.user_id.toString(), ratings_to_table),
          ratings_to_table
        )[0].beer_id
      } );`;
    } else {
      finalInsert += `( ${user.user_id}, ${
        findSuggestedBeer(
          find3ClosestNeighbour(user.user_id.toString(), ratings_to_table),
          ratings_to_table
        )[0].beer_id
      } ),`;
    }
  });
  console.log(finalInsert);
  db.query(`DELETE FROM recommendations`)
    .then((res) => console.log("deleted:works:", res))
    .catch((e) => console.log("deleted:failed:", e));

  db.query(
    `
      INSERT INTO recommendations (user_id, beer_id)
      VALUES ${finalInsert}
      `
  )
    .then((res) => console.log("Added:works:", res.rows))
    .catch((e) => console.log("Added: failed:", null));
};
exports.recommendationEngine = recommendationEngine;
