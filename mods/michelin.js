
const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');


//'lil problme here, must reset the file 

if (fs.existsSync('./data/rest.json')) {
  fs.truncate('./data/rest.json', 0, function() {
  })
}


var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./data/links.txt')
});

lineReader.on('line', function(line) {
  request({
    uri: line,
  }, function(error, response, body) {
    if (error) return console.log(error);
    var field = cheerio.load(body);
    var restaurant = {};
    restaurant['name'] = field('.poi_intro-display-title').text().trim();
	var locality = field('.poi_intro-display-address .field__items .locality').text();
    var thoroughfare = field('.poi_intro-display-address .field__items .thoroughfare').text();
    var postalcode = field('.poi_intro-display-address .field__items .postal-code').text();
	var price = field('.node_poi-menu-intro node_poi-row .node_po-price .priceRange' ).text();
    var address = {};
	address['price'] = price;
    address['thoroughfare'] = thoroughfare;
    address['postalcode'] = postalcode;
    address['locality'] = locality;
    restaurant['address'] = address;
    try {
		console.log( restaurant);

      fs.appendFile("./data/rest.json", JSON.stringify(restaurant) + "\n");
    } catch (err) {
    }
  }).on('error', function(err) {
  }).end()
});
