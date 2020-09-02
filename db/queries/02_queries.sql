      -- SELECT beers.*, SUM(reviews.*) as num_review FROM beers
      -- JOIN reviews ON reviews.beer_id = beers.id
      -- GROUP BY beers.id
      -- ORDER BY avg_rank DESC

      SELECT beers.*, COUNT(reviews.*) as num_reviews FROM beers
      LEFT JOIN reviews ON reviews.beer_id = beers.id
      WHERE reviews.user_id NOT IN (3)
      GROUP BY beers.id 
      ORDER BY num_reviews DESC
      LIMIT 10

        SELECT beers.*, COUNT(reviews.*) as num_reviews FROM beers
      LEFT JOIN reviews ON reviews.beer_id = beers.id
      GROUP BY beers.id 
      ORDER BY num_reviews DESC
      LIMIT 10