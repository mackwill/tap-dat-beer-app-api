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
