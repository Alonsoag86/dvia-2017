#!/usr/bin/env node
var fs = require('fs'),
    _ = require('lodash'),
    handlebars = require('handlebars');

var tmplSource = fs.readFileSync('template.html', 'utf-8'),
    template = handlebars.compile(tmplSource),
    data = JSON.parse(fs.readFileSync('assets/shows.json', 'utf-8'));

var byArtist = _.groupBy(data, 'artist');
    byVenue = _.groupBy(data, 'venue'),
    names = _.uniq(_.map(data, 'artist')).sort();

var shows = []
names.forEach(function(name){
  shows.push(byArtist[name])
})

var markup = template({names:names, shows:shows})
fs.writeFileSync('site/index.html', markup)
