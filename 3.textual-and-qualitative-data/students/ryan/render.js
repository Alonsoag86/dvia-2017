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


// console.log(places);

var byVenueEachDay = []
for (i=0;i<places.length;i++) {
  for (j=0;j<4;j++) {
    for (k=0;k<byVenue[places[i]].length;k++) {
      var venue = places[i];
      var band = ' '
      var settime = ' '
      if (byVenue[places[i]][k]['time']['day'] === j) {
        venue = places[i];
        band = byVenue[places[i]][k]['artist'];
        settime = byVenue[places[i]][k]['schedule']['start'] + '  ........  ' + byVenue[places[i]][k]['schedule']['end'];
        var byVenueEachDayObj = {place:venue, day:j, artistname:band, showtime:settime};
        byVenueEachDay.push(byVenueEachDayObj);
      }
    }
    var venue = places[i];
    var band = ' '
    var settime = ' '
    var byVenueEachDayObj = {place:venue, day:j, artistname:band, showtime:settime};
    byVenueEachDay.push(byVenueEachDayObj);
  }
}

var byVenueEachDayGrouped = _.groupBy(byVenueEachDay,'place')

 // console.log(byVenueEachDay);

 for (i=0;i<Object.keys(byVenueEachDayGrouped).length;i++) {
   byVenueEachDayGrouped[Object.keys(byVenueEachDayGrouped)[i]] = _.groupBy(byVenueEachDayGrouped[Object.keys(byVenueEachDayGrouped)[i]],'day');
  //  console.log(byVenueEachDayGrouped[Object.keys(byVenueEachDayGrouped)[i]]);
 }

 console.log(byVenueEachDayGrouped['Brooklyn Bowl']);

var markup = template({byVenueEachDay: byVenueEachDayGrouped})
fs.writeFileSync('site/index.html', markup)
