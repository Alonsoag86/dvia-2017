#!/usr/bin/env node
var fs = require('fs'),
    _ = require('lodash'),
    handlebars = require('handlebars');

var tmplSource = fs.readFileSync('template.html', 'utf-8'),
    template = handlebars.compile(tmplSource),
    data = JSON.parse(fs.readFileSync('assets/shows.json', 'utf-8'));
    data2 = JSON.parse(fs.readFileSync('assets/artists.json', 'utf-8'));

var byArtist = _.groupBy(data, 'artist');
    byVenue = _.groupBy(data, 'venue'),
    names = _.uniq(_.map(data, 'artist')).sort();
    CountGigs = _.sortBy(names, names.length);
    venues = _.uniq(_.map(data, 'venue')).sort();
    byBand = _.groupBy(data2, 'artist');

var shows = []
names.forEach(function(name){
  shows.push(byArtist[name])
})

var shows2 = []
venues.forEach(function(name){
  shows2.push(byVenue[name])
})

var shows3 = []
names.forEach(function(name){
  shows3.push(byBand[name])
})



// console.log(data2);



var markup = template({names:names, shows:shows, venues:venues, shows2:shows2})
fs.writeFileSync('site/index.html', markup)
