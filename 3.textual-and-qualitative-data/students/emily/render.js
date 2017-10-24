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
    duration = _.uniq(_.map(data, 'time.duration'));

var shows = []
    names.forEach(function(name){
    shows.push(byArtist[name])
    });

var venues = []
    listVenue.forEach(function(venue){
    venues.push(byVenue[venue]);;
    });

var showsCount = _.countBy(data,'venue') //number of shows at each venue
var totalCount = _.sum(_.values(showsCount)) //total number of shows at all venues
var totalShowCount =  _.countBy(venues, 'venue'); //total number of venues
var allDurationTotal= _.sum(_.values(venueObjects, 'totalDuration')); //total minutes played at all venues

var venueObjects = [];
for (var venueName in venueShows){ // iterate through the keys of venueShows
    var totalDuration = _.sum(_.map(venueShows[venueName], 'time.duration')); //Attempt 1: sum all the time.duration values for a venueName
    var venueObj = {
        venue:venueName,
        venueDuration:totalDuration, //Attempt 1: return the sum for each venue and store in array
        shows:venueShows[venueName],
        numShows:venueShows[venueName].length,
        shows:venueShows[venueName]
    };
    venueObjects.push(venueObj)
};

// sort our list of venue objects by the number of shows per-venue
var countedVenues = _.sortBy(venueObjects, 'numShows');
    countedVenues.reverse(); // reverse the ordering so the most active venue comes first

// sort the original list of venue objects by venue name
var alphabetizedVenues = _.sortBy(venueObjects, 'venue');

// sort by venue name but ignore 'the' at the beginning of the name
var properlyAlphabetizedVenues = _.sortBy(venueObjects, function(obj){
  // use a regular expression to clip off the letters "the ", but only if they come at
  // the very beginning of the string (as indicated by the ^ below), and have it match
  // regardless of the capitalization of "the" (as indicated by the "/i")
  return obj.venue.replace(/^the /i, '')
});

// take our alphabetized venue list and make sure the artists in each
// venue are also listed in alphabetical order
var doubleAlphabetized = properlyAlphabetizedVenues.slice() // make a copy of the original list with slice
for (var i=0; i<doubleAlphabetized.length; i++){
  var venue = doubleAlphabetized[i]
  venue.shows = _.sortBy(venue.shows, 'artist')
}

var markup = template({names:names, shows:shows, venues:venues, showCount:showCount,
              totalShowCount:totalShowCount, totalCount:totalCount, venueObjects:venueObjects,
              doubleAlphabetized:doubleAlphabetized, allDurationTotal:allDurationTotal})
fs.writeFileSync('site/index.html', markup);
