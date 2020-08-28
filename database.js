const db = require("./server");

const getUserWithEmail = function (email) {
  return db
    .query(
      `
    SELECT * FROM users
    WHERE email = $1
  `,
      [emai]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.getUserWithEmail = getUserWithEmail;

const addUser = function (user) {
  const {
    first_name,
    last_name,
    email,
    password,
    password_confirmation,
  } = user;
  return db
    .query(
      `
    INSERT INTO users (first_name, last_name, email, password, password_confirmation)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `,
      [first_name, last_name, email, password, password_confirmation]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.addUser = addUser;

const getBeers = function () {
  db.query(
    `
  SELECT * FROM beers
  `
  )
    .then((res) => res.rows)
    .catch((e) => null);
};
exports.getBeers = getBeers;
