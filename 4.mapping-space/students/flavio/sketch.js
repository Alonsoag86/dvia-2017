// an array for the magnitude
var magnitudes;
// an array for depth
var depths;
// an array for lat & long
var latitudes, longitudes;

// minimum and maximum values for magnitude and depth
var magnitudeMin, magnitudeMax;
var depthMin, depthMax;

var type;

// the dots we'll be adding to the map
var circles = [];

// table as the data set
var table;

// my leaflet.js map
var mymap;

var ltlg;

function preload() {
    // load the CSV data into our `table` variable and clip out the header row
    table = loadTable("assets/all_month.csv", "csv", "header");
}

function setup() {
    /*
    P5 SETUP

    If you want to draw some diagrams to complement the map view, set up your canvas
    size, color, etc. here
    */

   // Move the canvas so it's inside our <div id="sketch-holder">.
    var canvas = createCanvas(1, 1);
    canvas.parent('dashdata');

    /*
    LEAFLET CODE

    In this case "L" is leaflet. So whenever you want to interact with the leaflet library
    you have to refer to L first.
    so for example L.map('mapid') or L.circle([lat, long])
    */

    // create your own map
    mymap = L.map('quake-map').setView([51.505, -0.09], 3);

    // load a set of map tiles (you shouldn't need to touch this)
    L.tileLayer('https://api.mapbox.com/styles/v1/flaviopessoa/cj9g2e2vu8l5p2rmq5yemwywl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmxhdmlvcGVzc29hIiwiYSI6IlE1REw1dnMifQ.qVX5tyZ1KQ0os20vZ8pR7w', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZHZpYTIwMTciLCJhIjoiY2o5NmsxNXIxMDU3eTMxbnN4bW03M3RsZyJ9.VN5cq0zpf-oep1n1OjRSEA'
    }).addTo(mymap);

    // call our function (defined below) that populates the maps with markers based on the table contents
    // drawBarCharts();
    drawDataPoints();


}

// function drawBarCharts(){
//   type = table.getColumn("type");
//
//   var counts = {};
//   for (var i = 0; i < type.length; i++) {
//   counts[type[i]] = 1 + (counts[type[i]] || 0);
//   };
//
//   noStroke();
//   fill('white');
//   for (var i=1; i < counts.length; i++){
//     rect(i*5, 300, 5, 10);
//   }
// // line(x, y, x, y);
// }

function drawDataPoints(){

    // get the two arrays of interest: depth and magnitude
    depths = table.getColumn("depth");
    magnitudes = table.getColumn("mag");
    latitudes = table.getColumn("latitude");
    longitudes = table.getColumn("longitude");
    type = table.getColumn("type");

    var counts = {};
    for (var i = 0; i < type.length; i++) {
    counts[type[i]] = 1 + (counts[type[i]] || 0);
    };
    console.log(counts);

    // get minimum and maximum values for both
    magnitudeMin = 0.0;
    magnitudeMax = getColumnMax("mag");
    console.log('magnitude range:', [magnitudeMin, magnitudeMax])

    depthMin = 0.0;
    depthMax = getColumnMax("depth");
    console.log('depth range:', [depthMin, depthMax])

    // cycle through the parallel arrays and add a dot for each event
    for(var i=0; i<depths.length; i++){

        // create a new dot
        var circle = L.circleMarker([latitudes[i], longitudes[i]], {

            fillColor: typeColor(i), // the dot fill color
            fillOpacity: 0.4,  // use some transparency so we can see overlaps
            radius: 10,
            stroke: stColorProg(i),
            color: 'grey',
            weight: 1,
            className: typeName(i)
        });

        // place it on the map
        circle.addTo(mymap);

        // save a reference to the circle for later
        circles.push(circle);
    }
}

console.log(circles);

function opacityProg(x) {
  if (type[x] == 'earthquake') return 0.1;
  if (type[x] == 'explosion') return 0.5;
  if (type[x] == 'ice quake') return 0.5;
  if (type[x] == 'quarry blast') return 0.5;
  if (type[x] == 'sonic boom') return 0.5;
  if (type[x] == 'chemical explosion') return 0.5;
}

function stColorProg(x){
  if (magnitudes[x] >= 5.5) return true; else return false};

function typeColor(x){
    if (type[x] == 'earthquake') return 'lightblue';
    if (type[x] == 'explosion') return 'yellow';
    if (type[x] == 'ice quake') return 'orange';
    if (type[x] == 'quarry blast') return 'pink';
    if (type[x] == 'sonic boom') return 'green';
    if (type[x] == 'chemical explosion') return 'red';
    };

function typeName(x){
    if (type[x] == 'earthquake') return 'earthquake';
    if (type[x] == 'explosion') return 'explosion';
    if (type[x] == 'ice quake') return 'ice quake';
    if (type[x] == 'quarry blast') return 'quarry blast';
    if (type[x] == 'sonic boom') return 'sonic boom';
    if (type[x] == 'chemical explosion') return 'chemical explosion';
    };

function removeAllCircles(){
    // remove each circle from the map and empty our array of references
    circles.forEach(function(circle, i){
        mymap.removeLayer(circle);
    })
    circles = [];
}

// get the maximum value within a column
function getColumnMax(columnName){
    // get the array of strings in the specified column
    var colStrings = table.getColumn(columnName);

    // convert to a list of numbers by running each element through the `float` function
    var colValues = _.map(colStrings, float);

    // find the max value by manually stepping through the list and replacing `m` each time we
    // encounter a value larger than the biggest we've seen so far
    var m = 0.0;
    for(var i=0; i<colValues.length; i++){
        if (colValues[i] > m){
            m = colValues[i];
        }
    }
    return m;

    // or do it the 'easy way' by using lodash:
    // return _.max(colValues);
}
