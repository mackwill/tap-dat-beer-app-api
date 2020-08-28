-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS tweets CASCADE;
-- DROP TABLE IF EXISTS comments CASCADE;
-- DROP TABLE IF EXISTS likes CASCADE;
-- DROP TABLE IF EXISTS followings CASCADE;

-- CREATE TABLE users(
--   id SERIAL PRIMARY KEY NOT NULL,
--   name VARCHAR(255) NOT NULL,
--   email VARCHAR(255) NOT NULL,
--   password VARCHAR(255) NOT NULL,
--   profile_image VARCHAR(255) DEFAULT 'https://i.imgur.com/nlhLi3I.png'
-- );

-- CREATE TABLE tweets(
--   id SERIAL PRIMARY KEY NOT NULL,
--   content VARCHAR(255) NOT NULL,
--   owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   creation_date TIMESTAMPTZ DEFAULT now()
-- );

-- CREATE TABLE comments(
--   id SERIAL PRIMARY KEY NOT NULL,
--   content VARCHAR(255) NOT NULL,
--   tweet_id INTEGER REFERENCES tweets(id) ON DELETE CASCADE,
--   owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE
-- );

-- CREATE TABLE likes(
--   id SERIAL PRIMARY KEY NOT NULL,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   tweet_id INTEGER REFERENCES tweets(id) ON DELETE CASCADE
-- );

-- CREATE TABLE followings(
--   id SERIAL PRIMARY KEY NOT NULL,
--   follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   followed_id INTEGER REFERENCES users(id) ON DELETE CASCADE
-- );

-- ALTER TABLE
--   tweets OWNER TO vincent;

-- ALTER TABLE
--   users OWNER TO vincent;

-- ALTER TABLE
--   comments OWNER TO vincent;
-- ALTER TABLE
--   likes OWNER TO vincent;
-- ALTER TABLE
--   followings OWNER TO vincent;