#!/usr/bin/env node
var fs = require('fs'),
    _ = require('lodash'),
    handlebars = require('handlebars');

var tmplSource = fs.readFileSync('template.html', 'utf-8'),
    template = handlebars.compile(tmplSource),
    data = JSON.parse(fs.readFileSync('assets/shows.json', 'utf-8'));

var byArtist = _.groupBy(data, 'artist');
    byTime = _.sortBy(data, function(h){
    	if (h.time.startHour == '0') 
    		h.time.startHour = '24';
    	if (h.time.startHour == '1') 
    		h.time.startHour = '25';
    	if (h.time.startHour == '2') 
    		h.time.startHour = '26';
    		return h.time.startHour;
    });

    byDay = _.groupBy(byTime, 'time.day');
    //console.log(byDay);

    byVenue = _.groupBy(data, 'venue');
    names = _.uniq(_.map(data, 'artist')).sort();
    days =  _.uniq(_.map(data, 'time.day')).sort();



var shows = []
  names.forEach(function(name){
  shows.push(byArtist[name])
})

 var showDate = []
 	 days.forEach(function(day){
  showDate.push(byDay[day])

 	})

var markup = template({names:names, shows:shows, showDate:showDate, days:days})
fs.writeFileSync('site/index.html', markup)

