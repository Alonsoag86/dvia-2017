#!/usr/bin/env node
var fs = require('fs'),
    _ = require('lodash'),
    handlebars = require('handlebars');

var tmplSource = fs.readFileSync('template.html', 'utf-8'),
    template = handlebars.compile(tmplSource),
    data = JSON.parse(fs.readFileSync('assets/shows_with_followers.json', 'utf-8'));

var byArtist = _.groupBy(data, 'artist');
    byVenue = _.groupBy(data, 'venue'),
    names = _.uniq(_.map(data, 'artist')).sort(); // gives list of sorted artists

    // sortedByVenue = _.sortBy(byVenue, function(d) {return d.length; });
    // byVenueCnt = _.mapValues(byVenue, function(o) { return o.length; });

var byDay = _.groupBy(data, function(d){ return d.time.day;});
	byDay = _.mapValues(byDay, function(a) {return a.length; });

var venueShowCntPerDay = data.reduce(function(accum, obj) {
	  var venue = accum[obj.venue] = accum[obj.venue] || {};
	  var day = venue[obj.time.day] = venue[obj.time.day] || { count: 0 };
	  var total = venue['total'] = venue['total'] || {count: 0};
	  day.count++;
	  total.count++;
	  return accum;
	}, {});

var shows = []
names.forEach(function(name){
  shows.push(byArtist[name]) // pushes in artists by artist first name
})
console.log(byDay);

// var markup = template({names:names, shows:shows})
// fs.writeFileSync('site/index.html', markup)
