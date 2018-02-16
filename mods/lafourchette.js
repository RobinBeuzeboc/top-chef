const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');

let separators = ['\'', ' ', '-'];
let regExp = new RegExp('[' + separators.join('') + ']', 'g')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./rest.json')
});

lineReader.on('line', function(line) {
  var restaurant_to_search = JSON.parse(line);
  var name = encodeURIComponent(restaurant_to_search["name"])
  var tokensAPI = restaurant_to_search["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ - /g, '-').split(regExp); //accents
   var linkParamatersAPI = "";
  for (var i = 0; i < tokensAPI.length - 1; i++) {
   linkParamatersAPI += tokensAPI[i] + '+';
   }
   linkParamatersAPI += tokensAPI[tokensAPI.length - 1];
  request({
    uri: "https://www.lafourchette.com/recherche/autocomplete?searchText=" + linkParamatersAPI + "&localeCode=fr",
    //uri: "https://m.lafourchette.com/api/restaurant-prediction?name=" + name (other API, will need to readjust the code)
  }, function(error, response, body) {
    if (error) return console.log(error);
    var $ = cheerio.load(body);
    var result = JSON.parse(body);
    var actual_restaurants = result['data']['restaurants'];
    for (var i = 0; i < actual_restaurants.length; i++) {
      // Try to find the restaurant with the adress/zipcode
      if (actual_restaurants[i]['zipcode'] == restaurant_to_search['address']['postalcode']) {
		  console.log(restaurant_to_search['address']['postalcode'] + " searching number: " + i);
        let matching_resto = actual_restaurants[i]
        let search = matching_resto["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ - /g, '-').split(regExp);
        var searchLinkParameters = "";
        for (var j = 0; j < search.length - 1; j++) {
          searchLinkParameters += search[i] + '-';
        }
        searchLinkParameters += search[search.length - 1];
        // aller sur la page de ce restaurant
        request({
          uri: "https://www.lafourchette.com/restaurant/" + searchLinkParameters + "/" + matching_resto['id_restaurant'],
        }, function(error, response, body) {
          if (error) return console.log(error);
          var $$ = cheerio.load(body);
          // scrapper promotions and events
          var restaurant = {}
          restaurant['name'] = matching_resto['name']
          var address = {}
          address['city'] = matching_resto['city']
          address['zipcode'] = matching_resto['zipcode']
          restaurant['address'] = address
          restaurant['event'] = $$('.saleType.saleType--event .saleType-title').text()
          restaurant['promotions'] = $$('.saleType.saleType--specialOffer .saleType-title').text()
          try {
            fs.appendFile("restFork.json", JSON.stringify(restaurant) + "\n");
          } catch (err) {
            console.log(err);
          }
        }).on('error', function(err) {
          console.log(err)
        }).end()
      }
    }
  }).on('error', function(err) {
    console.log(err)
  }).end()
});
