//GET USERS FROM THE RATINGS DATA
function getUsersFromRatings(ratings) {
  return getUnique(ratings, "user_id");
}

//TRANFORM RATINGS DATA INTO A TABLE FOR EASY ACCESS AND MANIPULATION
function transformDataToTable(data) {
  const ratings_to_table = {};
  data.forEach((elm) => {
    if (!ratings_to_table[elm.user_id]) {
      ratings_to_table[elm.user_id] = {};
      ratings_to_table[elm.user_id][elm.beer_id] = {
        rank: elm.rank,
        sour: elm.sour,
        sweet: elm.sweet,
        hoppy: elm.hoppy,
        bitter: elm.bitter,
      };
    } else {
      ratings_to_table[elm.user_id][elm.beer_id] = {
        rank: elm.rank,
        sour: elm.sour,
        sweet: elm.sweet,
        hoppy: elm.hoppy,
        bitter: elm.bitter,
      };
    }
  });
  return ratings_to_table;
}

//CALCULATE THE EUCLIDEAN DISTANCE BETWEEN 2 USERS
function euclideanSimilarity(user, otherUser) {
  var user = user;
  var otherUser = otherUser;

  const ratedBeers_id = Object.keys(user);
  var sumSquares = 0;
  for (let i = 0; i < ratedBeers_id.length; i++) {
    const rating_user = user[ratedBeers_id[i]];
    const rating_other_user = otherUser[ratedBeers_id[i]];

    if (rating_user != null && rating_other_user != null) {
      const userReviewData = Object.keys(rating_user);
      const otherUserReviewData = Object.keys(rating_other_user);
      for (let i = 0; i < userReviewData.length; i++) {
        const difference =
          rating_user[userReviewData[i]] -
          rating_other_user[otherUserReviewData[i]];
        sumSquares += difference * difference;
      }
    }
  }
  var distance = Math.sqrt(sumSquares);
  var similarityScore = 1 / (distance + 1);
  return similarityScore;
}

//COMPARE FUNCTION FOR EUCLIDEAN DISTANCES
function compare(a, b) {
  if (a.distance > b.distance) {
    return -1;
  }
  if (a.distance < b.distance) {
    return 1;
  }
  return 0;
}

//REMOVE DUPLICATES FROM ARRAY OF OBJECT
function getUnique(arr, comp) {
  const unique = arr
    .map((e) => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter((e) => arr[e])
    .map((e) => arr[e]);
  return unique;
}

//Helper: used by findSuggestedBeer
function findUserRatingsByUserName(userName, x = Infinity, dataTable) {
  const user_ratings = dataTable[userName];
  var props = Object.keys(user_ratings).map(function (key) {
    return { beer_id: key };
  }, user_ratings);
  props.sort(function (p1, p2) {
    return p2.value - p1.value;
  });
  var topX = props.slice(0, x);
  return topX;
}

//Neighbours => suggestedBeers
function findSuggestedBeer(neighbours, dataTable) {
  let topSuggestedBeer = [];

  neighbours.forEach((neighbour) => {
    topSuggestedBeer = [
      ...topSuggestedBeer,
      ...findUserRatingsByUserName(neighbour.name, 3, dataTable),
    ];
  });
  return getUnique(topSuggestedBeer);
}

//GET THE 3 CLOSEST NEIGHBOURS TO A SPECIFIC USER
function find3ClosestNeighbour(user, dataTable) {
  const users = Object.keys(dataTable);
  const stats = [];
  users.forEach((elm) => {
    stats.push({
      name: elm,
      distance: euclideanSimilarity(dataTable[user], dataTable[elm]),
    });
  });
  const sortedStats = stats.sort(compare);
  return sortedStats.slice(1, 4);
}
module.exports = {
  getUnique,
  compare,
  euclideanSimilarity,
  transformDataToTable,
  getUsersFromRatings,
  findUserRatingsByUserName,
  findSuggestedBeer,
  find3ClosestNeighbour,
};
