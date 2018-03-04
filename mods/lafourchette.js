const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio')


let punctuation = ['\'', ' ', '-'];
let regExp = new RegExp('[' + punctuation.join('') + ']', 'g')
let similarTarget = {} //found restaurants


var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./data/rest.json')
});


if (fs.existsSync('./data/restFork.json')) {
  fs.truncate('./data/restFork.json', 0, function() {})
}

lineReader.on('line', function(line) {
  var targetToFind = JSON.parse(line);
  var fieldsAPI = targetToFind["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ - /g, '-').split(regExp); //special characters replaced
  let parametersForLinks = "";
  for (var i = 0; i < fieldsAPI.length - 1; i++) {
    parametersForLinks += fieldsAPI[i] + '+';
  }
  parametersForLinks += fieldsAPI[fieldsAPI.length - 1];
  request({
    // uri: "https://www.lafourchette.com/recherche/autocomplete?searchText=" + linkParamatersAPI + "&localeCode=fr",
    uri: "https://m.lafourchette.com/api/restaurant-prediction?name=" + parametersForLinks, //use of the API this time
  }, function(error, response, body) {
    if (error) return console.log(error);
    if (body[0] != '<') {
      var listRests = JSON.parse(body);
      let targetAcquired = false
      if (listRests.length > 0) {
        for (var i = 0; i < listRests.length; i++) {
          if (targetAcquired) {
            break; // restaurant found
          }
          // make sure that this is the real restaurant by comparing their address/postalcode
          if (listRests[i]['address']['postal_code'] == targetToFind['address']['postalcode']) {
            similarTarget = listRests[i]
            targetAcquired = true

            let tokensSearch = similarTarget["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ - /g, '-').split(regExp);
            var searchLinkParameters = "";
            for (var i = 0; i < tokensSearch.length - 1; i++) {
              searchLinkParameters += tokensSearch[i] + '-';
            }
            searchLinkParameters += tokensSearch[tokensSearch.length - 1];
            similarTarget['link'] = "https://www.lafourchette.com/restaurant/" + searchLinkParameters + "/" + similarTarget['id']
            similarTarget['stars'] = targetToFind['stars']

            if (targetAcquired) {
              try {
                fs.appendFile("./data/restFork.json", JSON.stringify(similarTarget) + "\n"); //add existing restaurant from both michelin  and lafourchette
              } catch (err) {
                console.log(err);
              }
            }
          }
        }
      }
    }
  }).on('error', function(err) {
    console.log(err)
  }).end()
});

/*
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
});*/



/*
const request2 = require('request');
const fs2 = require('fs');
*/
/*
if (fs2.existsSync('.././docs/react-app/src/lafourchette_promotions.json')) {
  fs2.truncate('.././docs/react-app/src/lafourchette_promotions.json', 0, function() {
    try {
      fs2.appendFile(".././docs/react-app/src/lafourchette_promotions.json", "[", function() {});
    } catch (err) {
      console.log(err);
    }
  })
}*/
/*

promotion part
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./restFork.json')
});

console.log("Looking for promotions on lafourchette...");

lineReader.on('line', function(line) {
  let content = JSON.parse(line)
  request2({
    uri: "https://m.lafourchette.com/api/restaurant/" + content['id'] + "/sale-type",
  }, function(error, response, body) {
    if (error) return console.log(error);
    var result = JSON.parse(body);
    let restaurant = {}
    let promotions = []
    let hasPromo = false
    let j = 0
    for (var i = 0; i < result.length; i++) {
      // Verifier s'il y a une promotion ou un evenement
      if (result[i].hasOwnProperty('exclusions') && result[i]['exclusions'] != "" && result[i]['is_special_offer']) {
        hasPromo = true
        console.log("A restaurant with promotions(s) has been found !");
        promotions[j] = {}
        promotions[j]['title'] = result[i]['title']
        promotions[j]['exclusions'] = result[i]['exclusions']
        j += 1
      }
    }
    if (hasPromo) {
      restaurant['name'] = content['name']
      restaurant['address'] = content['address']
      restaurant['stars'] = content['stars']
      restaurant['promotions'] = promotions
      restaurant['link'] = content['link']

      try {
        fs.appendFile("./proms.json", JSON.stringify(restaurant) + ",\n", function() {});
      } catch (err) {
        console.log(err);
      }
    }
  }).on('error', function(err) {
    console.log(err)
  }).end()
});
*/
