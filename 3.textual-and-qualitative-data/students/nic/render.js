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
    duration = _.uniq(_.map(data, 'duration')).sort();

var shows = []
names.forEach(function(name){
  shows.push(byVenue[name])
})

var venues = []
location.forEach(function(venue){
	venues.push(byVenue[venue])
})

var markup = template({names:names, shows:shows, venues:venues, location:location})
fs.writeFileSync('site/index.html', markup)
