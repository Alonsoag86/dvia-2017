#!/usr/bin/env node
var fs = require('fs'),
    _ = require('lodash'),
    handlebars = require('handlebars');

var tmplSource = fs.readFileSync('template.html', 'utf-8'),
    template = handlebars.compile(tmplSource),
    data = JSON.parse(fs.readFileSync('assets/shows.json', 'utf-8'));

var byArtist = _.groupBy(data, 'artist');
    byVenue = _.groupBy(data, 'venue');
    listVenue = _.uniq(_.map(data, 'venue')).sort();
	showCount =  _.countBy(data, 'venue');
    names = _.uniq(_.map(data, 'artist')).sort();
    duration = _.uniq(_.map(data, 'duration')).sort();

var showsCount = _.countBy(data, 'venue')
// console.log('number of shows at each venue:', showsCount)

var totalCount = _.sum(_.values(showsCount))
// console.log('total number of shows at all venues:', totalCount)

// console.log('total number of venues:', _.keys(showsCount).length)


var shows = []
names.forEach(function(name){
  shows.push(byArtist[name])
});

var venues = []
listVenue.forEach(function(venue){
  venues.push(byVenue[venue]);
  // console.log(showCount);
});

var totalShowCount =  _.countBy(venues, 'venue');

// var duration = []
// duration.forEach(function(time){
// 	duration.push(duration[time])
// });

var markup = template({names:names, shows:shows, venues:venues, showCount:showCount, totalShowCount})
fs.writeFileSync('site/index.html', markup);
