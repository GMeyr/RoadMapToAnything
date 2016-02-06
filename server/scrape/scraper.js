var request = require('request-promise'),
    cheerio = require('cheerio'),
    targets = require('./scrapeTargets.json');

var MAX_LENGTH = 256,
    DEFAULT_TAG = 'meta',
    DEFAULT_ATTR = 'content';


// Post-processing helper functions
var clean = function(string) {
  if (string.length <= MAX_LENGTH) return string;
  return string.substring(0, MAX_LENGTH - 3) + '...';
};

var nameFromUrl = function(url) {
  if (!url) return url;

  var wwwIndex = url.indexOf('www.');
  var name;

  if (url.indexOf('/') === -1 && wwwIndex === -1) return url;

  var wwwIndex = url.indexOf('www.');
  var name;

  if (wwwIndex !== -1) name = url.substring(wwwIndex + 4);
  else name = url.substring(url.indexOf('//') + 2);

  name = name.substring(0, name.indexOf('/'));

  return name;
};

var appendRef = function(full, partial) {
  if (partial.substring(0, 2) === '//') {
    return full.substring( 0, full.indexOf('//') ) + partial;
  }

  return full + partial;
};


// Scrapes a property based on an array of possible target tags
var scrapeProperty = function($, targets) {
  var tag, prop, val, attr, scrape;

  for (var i = 0; i < targets.length; i++) {
    var target = targets[i];

    tag = target.tag || DEFAULT_TAG;
    prop = target.prop ? '[' + target.prop + '=' : '';
    val = target.val ?  '"' + target.val + '"]' : '';
    attr = target.attr || DEFAULT_ATTR;

    if (target.text) scrape = clean( $(tag + prop + val).text() );
    else scrape = $(tag + prop + val).attr(attr);

    if (scrape) return scrape;
  }
};


module.exports = function (url) {
  return request(url)
  .then(function (html) {
    var $ = cheerio.load(html);
    var scrapes = {};

    // Attempt to scrape every property in scrapeTargets.json
    for (var key in targets) {
      scrapes[key] = scrapeProperty($, targets[key]);
    }

    // Perform some post-processing on particular properties
    scrapes.siteName = nameFromUrl(scrapes.siteName);
    scrapes.siteIcon = appendRef(url, scrapes.siteIcon);
    
    return scrapes;
  });
};