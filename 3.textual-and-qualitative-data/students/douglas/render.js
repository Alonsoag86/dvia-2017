#!/usr/bin/env node
var fs = require('fs'),
    _ = require('lodash'),
    handlebars = require('handlebars');

var tmplSource = fs.readFileSync('template.html', 'utf-8'),
        template = handlebars.compile(tmplSource),
	    data = JSON.parse(fs.readFileSync('assets/shows.json', 'utf-8'));

//creare objects
var byArtist = _.groupBy(data, 'artist');
    byVenue = _.groupBy(data, 'venue'),
    //bySchedule = _.groupBy(data, 'schedule'),
    byDay = _.groupBy(data, 'time.day'),
    //byHour = _.groupBy(byDay['0'], 'time.hour'),

//create arrays
    //names = _.uniq(_.map(data, 'artist')).sort();
    uniqvenues = _.uniq(_.map(data, 'venue')).sort();
    artnames = _.map(data, 'artist');
    showdate = _.map(data, 'schedule.date');
    showvenues  = _.map(data, 'venue');
    
//sort objects


//var ArrayShows = _.sortBy(data, ['time.day', 'venue', 'time.starthour']);
var ArrayShows = _.sortBy(data, ['time.day', 'venue', 'time.startHour']);

var byDayByVenue = _.groupBy(ArrayShows, 'time.day');

//console.log(byDayByVenue);



for (var dayKey in byDayByVenue) {
    var lastVenue="";
    //console.log("Day " + dayKey);
    //console.log(byDayByVenue.length);
    for (var i=0; i<byDayByVenue[dayKey].length; i++) {
       //console.log("Venue: " + byDayByVenue[dayKey][i]['venue']);
       if (lastVenue == byDayByVenue[dayKey][i]['venue']) {
	  //console.log("Repeat");
	   lastVenue = byDayByVenue[dayKey][i]['venue'];
	   byDayByVenue[dayKey][i]['venue']="";
	}
       else {
	   lastVenue = byDayByVenue[dayKey][i]['venue'];
	}
    }
}


var shows = []
uniqvenues.forEach(function(vnu){
	  shows.push(byVenue[vnu])
})

//#console.log(byVenue['Alphaville']);
//console.log(byDay);
//console.log(byDayByVenue);
console.log(ArrayShows);

//var markup = template({hbnames:names, shows:shows})
//var markup = template({hbnames:artnames, hbshowdate:showdate})
//var markup = template({hbshows:shows})
//var markup = template({hbshows:byVenue['Alphaville']})
var markup = template({hbshows:byDayByVenue})
	fs.writeFileSync('site/index.html', markup)
