const db = require("./server");
const beers = require("./routes/beers");

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
      SELECT beers.*, CAST(AVG(reviews.rank) AS DECIMAL(10,2)) as avg_rank, COUNT(reviews.*) as num_reviews FROM beers
      LEFT JOIN reviews ON reviews.beer_id = beers.id
      GROUP BY beers.id  `
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

const getReviewsForSingleBeer = function (beer_id) {
  return db
    .query(
      `
  SELECT reviews.*, users.first_name FROM reviews
  JOIN users ON user_id = users.id
  WHERE beer_id = $1
  `,
      [beer_id]
    )
    .then((res) => res.rows)
    .catch((err) => null);
};

exports.getReviewsForSingleBeer = getReviewsForSingleBeer;

const getRecommendationsForUser = function (userId) {
  return db
    .query(
      `
  SELECT beers.* FROM beers
  JOIN recommendations ON beers.id = beer_id
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
    .query(`SELECT user_id, beer_id, rank FROM reviews`)
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

const searchForBeers = (query) => {
  //let q = `${query}:*`;
  //let q = query.replace(/ /g, " & ");
  let q = query;
  if (q.trim().split(" ").length === 1) {
    q = `${q.split(" ")[0]}:*`;
  } else if (q.trim().split(" ").length === 2) {
    q1 = `${q.split(" ")[0]}:*`;
    q2 = `${q.split(" ")[1]}:*`;
    q = `${q1} & ${q2}`;
  } else {
    q1 = `${q.split(" ")[0]}:*`;
    q2 = `${q.split(" ")[1]}:*`;
    q3 = `${q.split(" ")[2]}:*`;
    q = `${q1} & ${q2} & ${q3}`;
  }
  return db
    .query(
      `
  SELECT * FROM beers
  WHERE (setweight(to_tsvector(name), 'A') ||
  setweight(to_tsvector(brewery), 'B') ||
  setweight(to_tsvector(type), 'C'))
  @@ to_tsquery($1)
  ORDER BY ts_rank((setweight(to_tsvector(name), 'A') ||
  setweight(to_tsvector(brewery), 'B') ||
  setweight(to_tsvector(type), 'C')), to_tsquery($1)) DESC
`,
      [q]
    )
    .then((res) => res.rows)
    .catch((e) => null);
};
exports.searchForBeers = searchForBeers;

const getUserById = (id) => {
  return db
    .query(
      `
  SELECT * FROM users
  WHERE id = $1`,
      [id]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.getUserById = getUserById;

const newSearch = (newsearch) => {
  const { user_id, beer_id, query } = newsearch;
  if (!user_id) {
    return db
      .query(
        `
  INSERT INTO search_analytics (beer_id, query)
  VALUES ($1, $2)`,
        [beer_id, query]
      )
      .then((res) => res.rows)
      .catch((e) => null);
  } else {
    return db
      .query(
        `
  INSERT INTO search_analytics (user_id, beer_id, query)
  VALUES ($1, $2, $3)`,
        [user_id, beer_id, query]
      )
      .then((res) => res.rows)
      .catch((e) => null);
  }
};
exports.newSearch = newSearch;

const getSearchAnalytics = () => {
  return db
    .query(
      `
  SELECT * FROM search_analytics
  JOIN beers ON beer_id = beers.id`
    )
    .then((res) => res.rows)
    .catch((e) => null);
};
exports.getSearchAnalytics = getSearchAnalytics;

const getRecentlyViewedForUser = (id) => {
  return db
    .query(
      `
SELECT beers.* FROM search_analytics
JOIN beers ON beer_id = beers.id
JOIN users on search_analytics.user_id = users.id 
WHERE users.id = $1`,
      [id]
    )
    .then((res) => res.rows)
    .catch((e) => null);
};
exports.getRecentlyViewedForUser = getRecentlyViewedForUser;

const addToWishlist = (beer_id, user_id) => {
  return db
    .query(
      `
    INSERT INTO wishlists (beer_id, user_id)
    VALUES ($1, $2)
  `,
      [beer_id, user_id]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.addToWishlist = addToWishlist;

const deleteFromWishlist = (beer_id, user_id) => {
  return db
    .query(
      `
  DELETE FROM wishlists
  WHERE beer_id = $1
  AND user_id = $2;
  `,
      [beer_id, user_id]
    )
    .then((res) => res.rows[0])
    .catch((err) => res.status(500));
};

exports.deleteFromWishlist = deleteFromWishlist;

const getWishListByUserId = (user_id) => {
  return db
    .query(
      `
  SELECT beers.* FROM wishlists
  JOIN beers ON beer_id = beers.id
  WHERE user_id = $1`,
      [user_id]
    )
    .then((res) => res.rows)
    .catch((e) => null);
};
exports.getWishListByUserId = getWishListByUserId;

const createReview = (reviewObj) => {
  const {
    user_id,
    beer_id,
    sweet,
    sour,
    hoppy,
    bitter,
    rank,
    review,
  } = reviewObj;
  if (!review) {
    return db
      .query(
        `
      INSERT INTO reviews (user_id, beer_id, sweet, sour, hoppy, bitter, rank)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
  `,
        [user_id, beer_id, sweet, sour, hoppy, bitter, rank]
      )
      .then((res) => res.rows)
      .catch((e) => null);
  } else {
    return db
      .query(
        `
      INSERT INTO reviews (user_id, beer_id, sweet, sour, hoppy, bitter, rank, review)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `,
        [user_id, beer_id, sweet, sour, hoppy, bitter, rank, review]
      )
      .then((res) => res.rows)
      .catch((e) => null);
  }
};
exports.createReview = createReview;

const addNote = (note) => {
  const { user_id, beer_id, text } = note;
  return db
    .query(
      `
  INSERT INTO notes (user_id, beer_id, text)
  VALUES ($1, $2, $3)`,
      [user_id, beer_id, text]
    )
    .then((res) => res.rows[0])
    .catch((e) => null);
};
exports.addNote = addNote;
