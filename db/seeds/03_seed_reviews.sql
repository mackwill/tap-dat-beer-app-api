INSERT INTO reviews (user_id, beer_id, rank)
VALUES 
(1,1,5),(1,2,4),(1,3,3),(1,4,2),(1,5,3),
(2,1,4),(2,2,4),(2,3,2),(2,4,3),(2,5,3),
(3,1,3),(3,2,3),(3,3,5),(3,4,3),(3,5,4),
(4,1,4),(4,2,3),(4,3,5),(4,4,3),(4,5,4),
(5,1,2),(5,2,2),(5,3,4),(5,4,2),(5,5,4),
(6,1,5),(6,2,1),(6,3,5),(6,4,4),(6,5,5),
(7,1,1),(7,2,5),(7,3,4),(7,4,4),(7,5,2),
(8,1,1),(8,2,2),(8,3,4),(8,4,5),(8,5,2),
(9,1,3),(9,2,3),(9,3,3),(9,4,5),(9,5,5);

INSERT INTO reviews (user_id, beer_id, review, sweet, sour, hoppy, bitter, rank)
VALUES
(1,2,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nunc odio, bibendum ut enim quis.',5,4,4,4,7),
(2,2,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nec cursus ipsum. Aenean efficitur tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nec cursus ipsum. Aenean efficitur tellus.',1,5,4,4,6),
(1,12,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in risus vehicula, facilisis mauris non.',4,4,3,1,4),
(1,6,'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',5,5,1,4,9),
(3,2,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In blandit porttitor eros, sit amet luctus.',3,1,1,3,7),
(2,12,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse rhoncus sit amet orci ultrices ultricies.',1,2,2,3,4),
(3,6,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In blandit porttitor eros, sit amet luctus.',3,3,4,2,8);