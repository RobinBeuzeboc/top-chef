const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');
//const restaurants : Produce = {name:"",address:{thoroughfare:"",postalcode:"",locality:""};
let separators = ['\'', ' ', '-'];
let regExp = new RegExp('[' + separators.join('') + ']', 'g')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('rest.json')
});

lineReader.on('line', function(line) {
  var restaurant_to_search = JSON.parse(line);
  var name = encodeURIComponent(restaurant_to_search["name"])

  request({
    uri: "https://m.lafourchette.com/api/restaurant-prediction?name=" + name,
  }, function(error, response, body) {
    if (error) return console.log(error);
    var $ = cheerio.load(body);
    var result = JSON.parse(body);
    var restaurants_result = result['data']['restaurants'];
    for (var i = 0; i < restaurants_result.length; i++) {
      if (restaurants_result[i]['zipcode'] == restaurant_to_search['address']['postalcode']) {
        let matching_resto = restaurants_result[i]
        let tokensSearch = matching_resto["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ - /g, '-').split(regExp);
        var searchLinkParameters = "";
        for (var i = 0; i < tokensSearch.length - 1; i++) {
          searchLinkParameters += tokensSearch[i] + '-';
        }
        searchLinkParameters += tokensSearch[tokensSearch.length - 1];

        request({
          uri: "https://www.lafourchette.com/restaurant/" + searchLinkParameters + "/" + matching_resto['id_restaurant'],
        }, function(error, response, body) {
          if (error) return console.log(error);
          var $$ = cheerio.load(body);

          var restaurant = {}
          restaurant['name'] = matching_resto['name']
          var address = {}
          address['city'] = matching_resto['city']
          address['zipcode'] = matching_resto['zipcode']
          restaurant['address'] = address
          restaurant['event'] = $$('.saleType.saleType--event .saleType-title').text()
          restaurant['promotions'] = $$('.saleType.saleType--specialOffer .saleType-title').text()
          try {
            fs.appendFile("restF.json", JSON.stringify(restaurant) + "\n");
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
