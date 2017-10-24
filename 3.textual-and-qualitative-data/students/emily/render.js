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
    venueShows = _.groupBy(data, 'venue'),   // a dictionary with venue names as keys, and lists of shows as values
    names = _.uniq(_.map(data, 'artist')).sort();
    duration = _.uniq(_.map(data, 'duration'));

var showsCount = _.countBy(data,'venue')
// console.log('number of shows at each venue:', showsCount)
var totalCount = _.sum(_.values(showsCount))
// console.log('total number of shows at all venues:', totalCount)
var totalShowCount =  _.countBy(venues, 'venue');
// console.log(totalShowCount);
// console.log('total number of venues:', _.keys(showsCount).length)

var shows = []
    names.forEach(function(name){
    shows.push(byArtist[name])
    });

var venues = []
    listVenue.forEach(function(venue){
    venues.push(byVenue[venue]);;
  // console.log(venues);
    });;

var venueObjects = [];
for (var venueName in venueShows){ // iterate through the keys of venueShows
    var totalDuration = _.sum(_.map(venueShows[venueName], 'time.duration')); //Attempt 1: sum all the time.duration values for a venueName
    var venueObj = {
        venue:venueName,
        duration:totalDuration, //Attempt 1: return the sum for each venue and store in array
        numShows:venueShows[venueName].length,
        shows:venueShows[venueName]
    };
    venueObjects.push(venueObj)
};
console.log(venueObjects);

// sort our list of venue objects by the number of shows per-venue
var countedVenues = _.sortBy(venueObjects, 'numShows');
    countedVenues.reverse(); // reverse the ordering so the most active venue comes first

// sort the original list of venue objects by venue name
var alphabetizedVenues = _.sortBy(venueObjects, 'venue');

var markup = template({names:names, shows:shows, venues:venues, showCount:showCount,
              totalShowCount:totalShowCount, totalCount:totalCount})
fs.writeFileSync('site/index.html', markup);
