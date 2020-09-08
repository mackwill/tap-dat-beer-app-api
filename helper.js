const jwt = require("jsonwebtoken");

//RETURN ARRAY OF UNIQUE OBJECTS
function getUnique(arr, comp) {
  const unique = arr
    .map((e) => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter((e) => arr[e])
    .map((e) => arr[e]);
  return unique;
}
exports.getUnique = getUnique;

//RETURN THE TOP 10 MOST POPULAR SEARCHES
const returnTop10Searches = (data) => {
  const arrayOfBeerId = data.map((elm) => elm.beer_id);

  const arrayAsTableWithCount = arrayOfBeerId.reduce(function (prev, cur) {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});
  const tableKey = Object.keys(arrayAsTableWithCount);
  const arrayOfObjectWithCount = tableKey.map((elm) => {
    return { beer_id: elm, num: arrayAsTableWithCount[elm] };
  });
  const sortedSearchQuery = arrayOfObjectWithCount.sort((a, b) => {
    a.num > b.num;
  });
  const top10Query = sortedSearchQuery.slice(0, 10);
  const top10QueryBeerId = top10Query.map((elm) => elm.beer_id);

  const uniqueSearch = getUnique(data, "beer_id");
  const finalData = uniqueSearch.filter((elm) =>
    top10QueryBeerId.includes(elm.beer_id.toString())
  );
  return finalData;
};
exports.returnTop10Searches = returnTop10Searches;

//AUTHENTICATE MIDDLEWARE FOR THE JSONWEBTOKEN
function authenticate(req, res, next) {
  console.log("getting header:", req.headers);
  const brutToken = req.headers.authorization;
  // const token = req.session.token;
  if (brutToken == null) return res.sendStatus(401);
  const token = brutToken.split(" ")[1];
  console.log("MY BRUT TOKEN:", brutToken);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
  });
  next();
}
exports.authenticate = authenticate;

//RETURN EUCLEDIAN DISTANCE BETWEEN 2 BEERS
function newEuclidean(mainBeer, beer) {
  let typeSumSquare = 0;
  let brandSumSquare = 0;
  let ibvSumSquare = 0;

  if (beer.type === mainBeer.type) {
    typeSumSquare += 1;
  }
  if (beer.brewery === mainBeer.brewery) {
    brandSumSquare += 1;
  }
  if (beer.abv === mainBeer.abv) {
    ibvSumSquare += 1;
  }

  var distance = Math.sqrt((typeSumSquare + brandSumSquare + ibvSumSquare) / 3);
  var similarityScore = distance;
  return similarityScore;
}

//FIND CLOSEST BEER USING CONTENT FILTERING
function find9ClosestNeighbour(beer, beers) {
  const stats = [];
  beers.forEach((elm) => {
    stats.push({
      id: elm.id,
      distance: newEuclidean(beer, elm),
    });
  });
  function compare(a, b) {
    if (a.distance > b.distance) {
      return -1;
    }
    if (a.distance < b.distance) {
      return 1;
    }
    return 0;
  }
  const sortedStats = stats.sort(compare);
  const sortedStatsWithoutCurrent = sortedStats.filter(
    (elm) => elm.id !== beer.id
  );

  return sortedStatsWithoutCurrent.slice(0, 6).map((elm) => elm.id);
}

//RETURN ARRAY OF SIMILAR BEER OBJECTS
const getSimilarBeers = (currentBeer, otherBeers) => {
  const similarBeers = otherBeers.filter((elm) =>
    find9ClosestNeighbour(currentBeer, otherBeers).includes(elm.id)
  );
  return similarBeers;
};

exports.getSimilarBeers = getSimilarBeers;
