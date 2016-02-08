var handleError = require('../util.js').handleError,
    request = require('request-promise'),
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
      res.status(200).json({ data: scrape(html, url) });
    });
  }

};

