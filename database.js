const db = require("./server");

const getUserWithEmail = function (email) {
  return db
    .query(
      `
    SELECT * FROM users
    WHERE email = $1
  `,
      [email]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.getUserWithEmail = getUserWithEmail;

const addUser = function (user) {
  const { firstName, lastName, email, password } = user;
  return db
    .query(
      `
    INSERT INTO users (first_name, last_name, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
      [firstName, lastName, email, password]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.addUser = addUser;

const getBeers = function () {
  return db
    .query(
      `
  SELECT * FROM beers
  `
    )
    .then((res) => res.rows)
    .catch((e) => null);
};
exports.getBeers = getBeers;

const getASingleBeer = function (beer_id) {
  return db
    .query(
      `
  SELECT * FROM beers
  WHERE id = $1
  `,
      [beer_id]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.getASingleBeer = getASingleBeer;

const getRecommendationsForUser = function (userId) {
  return db
    .query(
      `
  SELECT * FROM recommendations
  WHERE user_id = $1
  `,
      [userId]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.getRecommendationsForUser = getRecommendationsForUser;

const getAllRatings = function () {
  return db
    .query(`SELECT * FROM ratings`)
    .then((res) => res.rows)
    .catch((e) => null);
};
exports.getAllRatings = getAllRatings;

const getAllUsers = function () {
  return db
    .query(`SELECT * FROM users`)
    .then((res) => res.rows)
    .catch((e) => null);
};
exports.getAllUsers = getAllUsers;

const deleteRecommendationByUserId = function (user_id) {
  return db.query(
    `
  DELETE FROM recommendations
  WHERE id = $1
  `,
    [user_id]
  );
};
exports.deleteRecommendationByUserId = deleteRecommendationByUserId;

const createRecommendation = function (recommendation) {
  const { user_id, beer_id } = recommendation;
  return db.query(
    `
      INSERT INTO recommendations (user_id, beer_id)
      VALUES ($1, $2)
    `,
    [user_id, beer_id]
  );
};
exports.createRecommendation = createRecommendation;
