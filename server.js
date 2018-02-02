var request = require("request");
var cheerio = require("cheerio");

var nb_of_pages = 0;

request({
  uri: "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin"
}, function(error, response, body) {
  var $ = cheerio.load(body);

  $(".poi-card-link").each(function() {
    var link = $(this);
    var name =  $(this).find('.poi_card-display-title').text();
    var href = link.attr("href");

    console.log(name + " -> " + "https://restaurant.michelin.fr" +  href);
  });
//nb of pages
  $(".mr-pager-link").each(function() {
    var link = $(this);

    if(nb_of_pages < parseInt(link.attr("attr-page-number")))
    {
      nb_of_pages = parseInt(link.attr("attr-page-number"));
    }

  });

  for(var i = 0; i  < nb_of_pages; i++)
  {
    request({
      uri: "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-"+ i
    }, function(error, response, body) {
      var $ = cheerio.load(body);
  //  console.log(i);
      $(".poi-card-link").each(function() {
        var link = $(this);
        var name =  $(this).find('.poi_card-display-title').text();
        var href = link.attr("href");

        console.log(name +" " + i +  " -> " + "https://restaurant.michelin.fr" +  href);
      });

    });
  }
});
