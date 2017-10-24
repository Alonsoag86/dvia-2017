#!/usr/bin/env node
var fs = require('fs'),
    _ = require('lodash'),
    handlebars = require('handlebars');


function loadTemplate(path){
  // loads a handlebars template file from <path> and returns a compiled templating function
  var src = fs.readFileSync(path, 'utf-8'),
      template = handlebars.compile(src);
  return template;
}


function loadJSON(path){
  // loads the text from the file at <path> and returns an unpacked Object or Array after decoding it
  var src = fs.readFileSync(path, 'utf-8'),
      data = JSON.parse(src);
  return data;
}

var template = loadTemplate('template.html'),    // assigns a function to 'template' that lets us generate HTML
    allShows = loadJSON('assets/shows.json'),    // a simple list of show dictionaries
    venueShows = _.groupBy(allShows, 'venue'),   // a dictionary with venue names as keys, and lists of shows as values
    artistShows = _.groupBy(allShows, 'artist'); // a dictionary with artist names as keys, and lists of shows as values


function print(value) {
  console.log(JSON.stringify(value, null, "---"));
}

// console.log(venueShows);


// create a list of objects of the form:
// {venue:"name of venue", shows:[{...}, {...}, ...], numShows:#}
var venueObjects = [];
for (var venueName in venueShows){ // iterate through the keys of venueShows
  var venueObj = { venue:venueName, shows:venueShows[venueName], numShows:venueShows[venueName].length };
  venueObjects.push(venueObj)
};

// console.log(venueObjects);
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

var days = [{day:"thursday",venues:[]},{day:"friday",venues:[]},{day:"saturday",venues:[]},{day:"sunday",venues:[]}];
for (var i=0; i<properlyAlphabetizedVenues.length; i++){
  var venue = properlyAlphabetizedVenues[i]
  for (var j = 0; j < 4; j++) {
    var shows = _.filter(venue.shows, function(s){
      return s.time.day == j;
    })
    days[j].venues.push({venue:venue.venue, shows:shows})
  }
}

print(days[2].venues[2]);




// take our alphabetized venue list and make sure the artists in each
// venue are also listed in alphabetical order
var doubleAlphabetized = properlyAlphabetizedVenues.slice() // make a copy of the original list with slice
for (var i=0; i<doubleAlphabetized.length; i++){
  var venue = doubleAlphabetized[i]
  venue.shows = _.sortBy(venue.shows, 'artist')
}

// take the alphabetized venue list and group the performances by day
// this will mean each item in the list has a 'days' list rather than a 'shows' list. Instead,
// each item in the 'days' list is an object with information about the day/date, and a list of 'shows':
// [{venue:"name", days:[{date:"text date", day:#, shows[{...}, {...}, ...] }] }, ...]
var dayByDayVenues = properlyAlphabetizedVenues.slice()
for (var i=0; i<dayByDayVenues.length; i++){
  var venue = _.clone(dayByDayVenues[i]);
  var grouped = _.groupBy(venue.shows, 'time.day');

  var days = []
  for (var day in grouped){
    var todaysShows = grouped[day];
    var today = {date:todaysShows[0].schedule.date, day:day, shows:todaysShows}
    days.push(today)
  }
  venue.days = _.sortBy(days, 'day')
  venue.numDays = venue.days.length
  delete venue.shows
}

//
// Now we can do the same kind of unpacking and re-ordering for the artists
//
var artistObjects = []
for (var artistName in artistShows){
  var artistObj = {name:artistName, shows:artistShows[artistName], numShows:artistShows[artistName].length}
  artistObjects.push(artistObj)
}

var alphabetizedArtists = _.sortBy(artistObjects, function(obj){
  return obj.name.replace(/^the /i, '').toLowerCase()
})
var countedArtists = _.sortBy(artistObjects, 'numShows').reverse();


// try swapping in any of the lists we built above:
// alphabetizedVenues, properlyAlphabetizedVenues, doubleAlphabetized, countedVenues, alphabetizedArtists, countedArtists
var markup = template({venues:doubleAlphabetized, artists:alphabetizedArtists})
fs.writeFileSync('site/index.html', markup)
