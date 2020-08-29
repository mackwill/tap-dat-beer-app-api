function getUnique(arr, comp) {
  const unique = arr
    .map((e) => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter((e) => arr[e])
    .map((e) => arr[e]);
  return unique;
}

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
