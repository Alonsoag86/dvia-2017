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

 function print(value) {
 	//writes out all the subkeys
  console.log(JSON.stringify(value, null, "---"));
}

function myDateThing(num){
	return num+7;
}

function makeDate(item){
	new Date(2017, 5, myDateThing(item.time.day), item.time.startHour,item.time.startMinute,00,0);
}

var template = loadTemplate('template.html'),    // assigns a function to 'template' that lets us generate HTML
    allShows = loadJSON('assets/shows.json'),    // a simple list of show dictionaries
    venueShows = _.groupBy(allShows, 'venue'),   // a dictionary with venue names as keys, and lists of shows as values
    artistShows = _.groupBy(allShows, 'artist'); // a dictionary with artist names as keys, and lists of shows as values

// create a list of objects of the form:
// {venue:"name of venue", shows:[{...}, {...}, ...], numShows:#}
var venueObjects = [];
for (var venueName in venueShows){ // iterate through the keys of venueShows
  var venueObj = { venue:venueName, shows:venueShows[venueName], numShows:venueShows[venueName].length};
  venueObjects.push(venueObj)
};

print(venueObjects[0]);

// makeDate(venueObj.shows);
// sort our list of venue objects by the number of shows per-venue
var countedVenues = _.sortBy(venueObjects, 'numShows');
countedVenues.reverse(); // reverse the ordering so the most active venue comes first

// sort the original list of venue objects  by venue name
var alphabetizedVenues = _.sortBy(venueObjects, 'venue');

// sort by venue name but ignore 'the' at the beginning of the name
var properlyAlphabetizedVenues = _.sortBy(venueObjects, function(obj){
  // use a regular expression to clip off the letters "the ", but only if they come at
  // the very beginning of the string (as indicated by the ^ below), and have it match
  // regardless of the capitalization of "the" (as indicated by the "/i")
  return obj.venue.replace(/^the /i, '')
});


var days = [{day:"Thursday June 7th",venues:[]},{day:"Friday June 8th",venues:[]},{day:"Saturday June 9th",venues:[]},{day:"Sunday June 10th",venues:[]}];
for (var i=0; i<properlyAlphabetizedVenues.length; i++){
  var venue = properlyAlphabetizedVenues[i]
  for (var j = 0; j < 4; j++) {
  	
  	var shows = _.sortBy(venue.shows, item => (makeDate(item)));
  

    shows = _.filter(shows, function(s){
      return s.time.day == j;
    })
    days[j].venues.push({venue:venue.venue, shows:shows})
  }
}



// print(days[0]);


var markup = template({days:days})
fs.writeFileSync('site/index.html', markup)
