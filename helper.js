const jwt = require("jsonwebtoken");

function getUnique(arr, comp) {
  const unique = arr
    .map((e) => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter((e) => arr[e])
    .map((e) => arr[e]);
  return unique;
}
exports.getUnique = getUnique;

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
  const token = req.session.token;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
  });
  next();
}
exports.authenticate = authenticate;

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
  return sortedStats.slice(0, 6).map((elm) => elm.id);
}

const getSimilarBeers = (currentBeer, otherBeers) => {
  const similarBeers = otherBeers.filter((elm) =>
    find9ClosestNeighbour(currentBeer, otherBeers).includes(elm.id)
  );
  return similarBeers;
};
exports.getSimilarBeers = getSimilarBeers;
