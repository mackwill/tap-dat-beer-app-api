SELECT beers.*, CAST(AVG(reviews.rank) AS DECIMAL(10,2)) as avg_rank, COUNT(reviews.*) as num_reviews FROM beers
JOIN reviews ON reviews.beer_id = beers.id
GROUP BY beers.id

-- SELECT beers.*, COUNT(whishlists.*) as num_whish FROM beers
-- JOIN whishlists ON beers.id = whishlists.beer_id
-- GROUP BY beers.id