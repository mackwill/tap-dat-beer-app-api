INSERT INTO search_analytics (user_id, beer_id, query)
VALUES (1, 2, 'stout');

-- INSERT INTO whishlists (beer_id, user_id)
-- VALUES (1, 1);

-- CREATE TABLE favourites(
--   id SERIAL PRIMARY KEY NOT NULL,
--   beer_id INTEGER REFERENCES beers(id) ON DELETE CASCADE,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
-- );

-- CREATE TABLE reviews(
--   id SERIAL PRIMARY KEY NOT NULL,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   beer_id INTEGER REFERENCES beers(id) ON DELETE CASCADE,
--   review VARCHAR(255) NOT NULL,
--   sweet INTEGER,
--   sour INTEGER,
--   hoppiness INTEGER,
--   bitter INTEGER,
--   rank INTEGER
-- );

-- CREATE TABLE upvotes(
--   id SERIAL PRIMARY KEY NOT NULL,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE
-- );

-- CREATE TABLE recommendations(
--   id SERIAL PRIMARY KEY NOT NULL,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   beer_id INTEGER REFERENCES beers(id) ON DELETE CASCADE
-- );
