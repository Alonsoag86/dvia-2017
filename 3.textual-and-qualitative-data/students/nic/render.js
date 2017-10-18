#!/usr/bin/env node
var fs = require('fs'),
    _ = require('lodash'),
    handlebars = require('handlebars');

var tmplSource = fs.readFileSync('template.html', 'utf-8'),
    template = handlebars.compile(tmplSource),
    data = JSON.parse(fs.readFileSync('assets/shows.json', 'utf-8'));



var byArtist = _.groupBy(data, 'artist');
    byVenue = _.groupBy(data, 'venue'),
    names = _.uniq(_.map(data, 'artist')).sort();
    location = _.uniq(_.map(data, 'venue')).sort();


var day0 = _.filter(data, function(d) {return d.time.day == 0; }),
    day1 = _.filter(data, function(d) {return d.time.day == 1; }),
    day2 = _.filter(data, function(d) {return d.time.day == 2; }), 
    day3 = _.filter(data, function(d) {return d.time.day == 3; });



var shows = []
names.forEach(function(name){
  shows.push(byVenue[name])
})

var venues = []
location.forEach(function(venue){
	venues.push(names[names])
})

var markup = template({names:names, shows:shows, venues:venues, location:location, day0:day0, day1:day1, day2:day2, day3:day3})
fs.writeFileSync('site/index.html', markup)
