#!/usr/bin/env node
var fs = require('fs'),
    _ = require('lodash'),
    handlebars = require('handlebars');

var tmplSource = fs.readFileSync('template.html', 'utf-8'),
    template = handlebars.compile(tmplSource),
    data = JSON.parse(fs.readFileSync('assets/shows.json', 'utf-8'));
    pop = JSON.parse(fs.readFileSync('assets/popularity.json','utf-8'));

var byArtist = _.groupBy(data, 'artist');
    byVenue = _.groupBy(data, 'venue'),
    names = _.uniq(_.map(data, 'artist')).sort();
    venues = _.uniq(_.map(data, 'venue')).sort();

pop = _.sortBy(pop,'visits').reverse();

var venuesorted = _.sortBy(pop,function(item) {
  return venues.indexOf(item.visits)
})

// names.forEach(function(name){
//   shows.push(byArtist[name])
// })

var places = []
for (i=0;i<venuesorted.length;i++) {
  places.push(_.map(venuesorted,'venue')[i])
}

for (i=0;i<Object.keys(byVenue).length;i++) {
  for (j=0;j<byVenue[Object.keys(byVenue)[i]].length;j++) {
    var ampm = byVenue[Object.keys(byVenue)[i]][j]['schedule']['start'].slice(-2);
    if (ampm === 'AM') {
      byVenue[Object.keys(byVenue)[i]][j]['time']['startHour'] = byVenue[Object.keys(byVenue)[i]][j]['time']['startHour'] + 24;
    };
  };
  byVenue[Object.keys(byVenue)[i]] = _.orderBy(byVenue[Object.keys(byVenue)[i]],['time[day]','time[startHour]','time[startMinute]'],['asc','asc','asc'])
}

console.log(byVenue['Warsaw'][0]['schedule']['start'].slice(-2));

// day one
var day_one_shows = []
var day_one_shows_artists = []
 for (i=0;i<places.length;i++) {
   for (j=0;j<byVenue[places[i]].length;j++) {
     if (byVenue[places[i]][j]['time']['day'] == 0) {
       day_one_shows.push(byVenue[places[i]][j])
     }
   }
 }
 var day_one_shows_grouped = _.groupBy(day_one_shows,'venue')

 // day two
 var day_two_shows = []
 var day_two_shows_artists = []
  for (i=0;i<places.length;i++) {
    for (j=0;j<byVenue[places[i]].length;j++) {
      if (byVenue[places[i]][j]['time']['day'] == 1) {
        day_two_shows.push(byVenue[places[i]][j])
      }
    }
  }
  var day_two_shows_grouped = _.groupBy(day_two_shows,'venue')

  // day three
  var day_three_shows = []
  var day_three_shows_artists = []
   for (i=0;i<places.length;i++) {
     for (j=0;j<byVenue[places[i]].length;j++) {
       if (byVenue[places[i]][j]['time']['day'] == 2) {
         day_three_shows.push(byVenue[places[i]][j])
       }
     }
   }
   var day_three_shows_grouped = _.groupBy(day_three_shows,'venue')


 // console.log(day_one_shows_grouped['Music Hall of Williamsburg']);

var markup = template({day_one_shows:day_one_shows_grouped, day_two_shows:day_two_shows_grouped, day_three_shows: day_three_shows_grouped})
fs.writeFileSync('site/index.html', markup)
