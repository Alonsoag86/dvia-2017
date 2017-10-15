#!/usr/bin/env node
var fs = require('fs'),
    _ = require('lodash'),
    handlebars = require('handlebars');

var tmplSource = fs.readFileSync('template.html', 'utf-8'),
    template = handlebars.compile(tmplSource),
    // data = JSON.parse(fs.readFileSync('assets/shows.json', 'utf-8'));
    venues = Object.keys(JSON.parse(fs.readFileSync('assets/venues.json', 'utf-8'))).sort(),
    data = JSON.parse(fs.readFileSync('assets/raw-data.json', 'utf-8'));

//var byArtist = _.groupBy(data, 'artist');
    //byVenue = _.groupBy(data, 'venue'),
    //names = _.uniq(_.map(data, 'artist')).sort();

//var shows = []
//names.forEach(function(name){
  //shows.push(byArtist[name])
//})

var arg = [];

alpha = Object.keys(data[0]["alphabetical"]).sort() // get alpha keys

alpha.forEach(function(a){

  var i = [];
  for(var idx=0; idx < data[0]["alphabetical"][a].artists.length; idx++) { 
    var idNum = data[0]["alphabetical"][a].artists[idx];
    var artistInfo = data[0]["artists"][idNum];
    var csvShowId = _.map(data[0]["artists"][idNum]["shows"], "id").join(",");
    if (csvShowId == "") continue;  // skip ongoing shows with no specific time
    var csvVenueTitle = _.map(data[0]["artists"][idNum]["shows"], "venueTitle").join(",");
    var FDate = _.map(data[0]["artists"][idNum]["shows"], "formattedDate");
    var csvEpoch = _.map(FDate, function(d){return Date.parse(d.split("&")[0])}).join(",");
    i.push( { id:idNum,  artist:artistInfo.title, sub:artistInfo.subtitle, img:artistInfo.imageURL, sIds:csvShowId, epochs:csvEpoch, vTitles:csvVenueTitle} ); // add elements
  }
  
  arg.push({cap: a, info:i}) // {csvTime, csvDate, csvVenueIds} }});
})

//artist  artistid subtitle img csvTime csvDate csvVenueID 
//venuename venueid
//date 

var d = ["Thursday, 8 June 2017", "Friday, 9 June 2017", "Saturday, 10 June 2017", "Sunday, 11 June 2017"]
var days = {"test":d, "d":d};

// names:names, shows:shows, 
var markup = template({days:days, arg:arg, venues:venues})
fs.writeFileSync('site/index.html', markup)
