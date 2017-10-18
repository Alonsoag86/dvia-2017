#!/usr/bin/env node
var fs = require('fs'),
    _ = require('lodash'),
    handlebars = require('handlebars');

var tmplSource = fs.readFileSync('template.html', 'utf-8'),
    template = handlebars.compile(tmplSource),
    data = JSON.parse(fs.readFileSync('assets/shows_with_followers.json', 'utf-8'));

//  add popCat to data
    getPopCat();
    cleanVenueNames();

//  sort data by order of appearance (by start hour field (check am/pm))
    data = _.sortBy(data, function(d) {return d.time.startHour; });
    // populateDayField();
//  create (1) byDayThurs, (2) byDayFri, (3) byDaySat, (4) byDaySun in order of appearance
var day0 = _.filter(data, function(d) {return d.time.day == 0; }),
    day1 = _.filter(data, function(d) {return d.time.day == 1; }),
    day2 = _.filter(data, function(d) {return d.time.day == 2; }), 
    day3 = _.filter(data, function(d) {return d.time.day == 3; });
    
//  venueCnt with Venues (sorted alphabetically); venue, showCnt, showCntCat
var venueCnt = getVenueCnt();
    venueCnt = _.sortBy(venueCnt, function(d) {return d.venue; });
    getShowCntCat();

    // console.log(day0);
//TODO - merge all days to 1 file that i can then use in the template

var markup = template({venues:venueCnt, day0:day0, day1:day1, day2:day2, day3:day3});
fs.writeFileSync('site/index.html', markup)

function populateDayField(){
    data.forEach(function(s){
        if (s.time.day == 0 )
            s.day0 = s.artist;
        else if (s.time.day == 1)
            s.day1 = s.artist;
        else if (s.time.day == 2)
            s.day2 = s.artist;
        else if (s.time.day ==3)
            s.day3 = s.artist;
    })
}

function cleanVenueNames(){
    data.forEach(function(s){
        s.venueClean = s.venue.replace('\'','').split(' ').join('');
    })
}

function getPopCat(){
    data.forEach(function(show){
        var pop = show.popularity;
        if (pop <= 25)
            show.popularityCat = 'small';
        else if (pop <=50)
            show.popularityCat = 'mid';
        else if (pop < 70)
            show.popularityCat = 'large';
        else
            show.popularityCat = 'xlarge';
    })
};

function getVenueCnt(){
    var venues = data.reduce(function(accum, item) {
        var venue = accum[item.venue] = accum[item.venue] || {};
        venue['venue'] = venue['venue'] || item.venue;
        venue['venueClean'] = venue['venueClean'] || item.venueClean;
        var total = venue['cnt'] = venue['cnt'] || 0;
        venue.cnt++;
        return accum;
    }, {});

    return venues;
};

function getShowCntCat(){
    venueCnt.forEach(function(v){
        var cnt = v.cnt;
        if (cnt <= 5)
            v.cntCat = 'small';
        else if (cnt <= 10)
            v.cntCat = 'mid';
        else if (cnt <= 15)
            v.cntCat = 'large';
        else
            v.cntCat = 'xlarge';
    })
}






    
/////////////////////////////////////////////

// var byArtist = _.groupBy(data, 'artist');
//     byVenue = _.groupBy(data, 'venue'),
//     names = _.uniq(_.map(data, 'artist')).sort(); // gives list of sorted artists

//     // sortedByVenue = _.sortBy(byVenue, function(d) {return d.length; });
//     // byVenueCnt = _.mapValues(byVenue, function(o) { return o.length; });

// var byDay = _.groupBy(data, function(d){ return d.time.day;});
//     byDay = _.mapValues(byDay, function(a) {return a.length; });
//     sortedArtist = _.sortBy(byArtist, function(a) {return a.length});
//     byArtistCnt = _.mapValues(sortedArtist, function(a) {return a.length; });

// var venueShowCntPerDay = data.reduce(function(accum, obj) {
//       var venue = accum[obj.venue] = accum[obj.venue] || {};
//       var day = venue[obj.time.day] = venue[obj.time.day] || { count: 0 };
//       var total = venue['total'] = venue['total'] || {count: 0};
//       day.count++;
//       total.count++;
//       return accum;
//     }, {});

// var shows = []
// names.forEach(function(name){
//   shows.push(byArtist[name]) // pushes in artists by artist first name
// })
// // console.log(byArtistCnt);

