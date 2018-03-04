const request2 = require('request');
const fs = require('fs');

if (fs.existsSync('./data/proms.json')) {
  fs.truncate('./data/proms.json', 0, function() {
  })
}

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./data/restFork.json')
});

lineReader.on('line', function(line) {
  var content = JSON.parse(line)
  request2({
    uri: "https://m.lafourchette.com/api/restaurant/" + content['id'] + "/sale-type",
  }, function(error, response, body) {
		
		var index = 0;
		var result = JSON.parse(body);
		var rest = {};
		var proms = [];
		var promoFound = false;
	   
		for (var i = 0; i < result.length; i++) {
			
			
		  // Had Help: search if there is a promo 
		  
		  
		  if (result[i].hasOwnProperty('exclusions') 
			  && result[i]['exclusions'] != "" 
			  && result[i]['is_special_offer']) {
			
			promoFound = true;
			proms[index] = {};
			proms[index]['title'] = result[i]['title'];
			proms[index]['exclusions'] = result[i]['exclusions'];
			index += 1;
		  }
		}
		if (promoFound) {
		  rest['name'] = content['name']
		  rest['address'] = content['address']
		  rest['stars'] = content['stars']
		  rest['promotions'] = proms
		  rest['link'] = content['link']

		  try {
			fs.appendFile("./data/proms.json", JSON.stringify(rest) + ",\n", function() {});
		  } catch (err) {
			console.log(err);
		  }
		}
  }).on('error', function(err) {
    console.log(err)
  }).end()
});
