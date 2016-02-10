var handleError = require('../util.js').handleError,
    request     = require('request-promise').defaults({maxRedirects:20}),
    scrape      = require('./scraper.js');

var blacklist = {
  pdf: true
};

module.exports = {

  scrape : function(req, res, next) {
    var url = req.query.url;
    
    // Prevent blacklisted extensions from hitting the scraper
    var extension = url.split('.').pop();
    if (blacklist[extension]) return res.sendStatus(400);

    request(url)
    .then(function (html) {
      var scrapedData = scrape(html, url);
      res.status(200).json({ data: scrapedData });
    });
  }

};
