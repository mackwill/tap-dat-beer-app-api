const request = require("request");
const fs = require("fs");

//Write INSERT INTO query into db seeds
fs.writeFile(
  "db/seeds/02_seed_beers.sql",
  "INSERT INTO beers (name, brewery, beer_image, type, abv, beer_store_id)\nVALUES \n",
  (err) => {
    if (err) throw err;
    console.log("done");
  }
);

//Request OntarioBeerApi and write it to the insert query
request("http://ontariobeerapi.ca/beers/", { json: true }, (err, res, body) => {
  if (err) {
    return console.log(err);
  }

  body
    .filter((elm) => elm.category === "Ontario Craft")
    .forEach((beer, index) => {
      if (
        index ===
        body.filter((elm) => elm.category === "Ontario Craft").length - 1
      ) {
        setTimeout(function () {
          fs.appendFile(
            "db/seeds/02_seed_beers.sql",
            `('${beer.name}', '${beer.brewer}', '${beer.image_url}', '${beer.type}', ${beer.abv}, ${beer.beer_id});`,
            (err) => {
              if (err) throw err;
            }
          );
        }, 1000);
      } else {
        fs.appendFile(
          "db/seeds/02_seed_beers.sql",
          `('${beer.name}', '${beer.brewer}', '${beer.image_url}', '${beer.type}', ${beer.abv}, ${beer.beer_id}),`,
          (err) => {
            if (err) throw err;
          }
        );
      }
    });
});
