#!/usr/bin/env node
var fs = require('fs'),
    _ = require('lodash'),
    handlebars = require('handlebars');



var tmplSource = fs.readFileSync('template.html', 'utf-8'),
    template = handlebars.compile(tmplSource),
    data = JSON.parse(fs.readFileSync('assets/artists.json', 'utf-8'));  //made it into workable list type intformation + reoder things + include and skip over //
// //lowdash is here
// //    var ordered = _.sortby(data, ['venue','artist'])
// //    var markup = template ({shows:ordered})
//
// // for (var i=0; i<data.length; i++){
// //   var item = data[i]
// //   if (item.venue=='Knitting Factory')}
// // keep this if you want to filter stuff out
//
// // sortby is very important
//
// var byArtist = _.groupBy(data, 'artist');
//     byVenue = _.groupBy(data, 'venue'),
//     names = _.uniq(_.map(data, 'artist')).sort();
//
// var shows = []
// names.forEach(function(name){
//   shows.push(byArtist[name])
// })

var markup = template({byArtist:data})  //this helps you mark as a key, you type what you want template.html and then it changes in the index.html//
fs.writeFileSync('site/index.html', markup)
