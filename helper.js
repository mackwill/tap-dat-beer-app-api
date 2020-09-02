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
