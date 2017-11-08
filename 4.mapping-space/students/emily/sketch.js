// an array for the magnitude
var magnitudes;
// an array for depth
var depths;
// an array for lat & long
var latitudes, longitudes;

// minimum and maximum values for magnitude and depth
var magnitudeMin, magnitudeMax;
var depthMin, depthMax;

// the dots we'll be adding to the map
var circles = [];

// table as the data set
var table;

// my leaflet.js map
var mymap;

// slider by github:rikghosh
// create slider
var slider;

//earthquakes selected
var earthquake;

var w = windowWidth;
var h=windowHeight/2;

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
    createCanvas(windowWidth, windowHeight/5);
    background(0);

    //create slider
    slider = createSlider(0, 7, 0.00, 0.05);
    slider.position(windowWidth*.05, windowHeight*.88);
    slider.style('width', String(windowWidth *.80));

    keyPressed();

    /*
    LEAFLET CODE

    In this case "L" is leaflet. So whenever you want to interact with the leaflet library
    you have to refer to L first.
    so for example L.map('mapid') or L.circle([lat, long])
    */

    // create your own map
    // mymap = L.map('quake-map').setView([51.505, -0.09], 3);

    mymap = L.map('quake-map').setView([10,0], 1.5);
    mymap._layersMaxZoom=15; 
    mymap.doubleClickZoom=true;
    mymap.options.zoomDelta=6;

    // load a set of map tiles (you shouldn't need to touch this)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets-satellite',
        // id: 'mapbox.streets-satellite',
        // id: 'mapbox.satellite-streets-v9',
        accessToken: 'pk.eyJ1IjoiZHZpYTIwMTciLCJhIjoiY2o5NmsxNXIxMDU3eTMxbnN4bW03M3RsZyJ9.VN5cq0zpf-oep1n1OjRSEA'
    }).addTo(mymap);

    slider.changed(coverOld);

}

function draw(){

    strokeWeight(2);
    stroke(255);
    // fill(110, 101, 110);
    fill(0);
    rect(windowWidth*.88, windowHeight*.01, 70, 30);

    removeAllCircles();
    // variable for current value of slider to subset data
    earthquake = slider.value();
    
    fill(182, 162, 141);
    noStroke();
    textFont('Helvetica Neue');
    text(slider.value(), windowWidth*.90, windowHeight*.039);
    // cover old text when slider is changed with blank box

    // call our function (defined below) that populates the maps with markers based on the table contents
    drawDataPoints();
}

function coverOld() {
    noStroke();
    // fill(110, 81, 109);
    fill(0);
    rect(windowWidth*.88, windowHeight*.01, 70, 30);
    };

function drawDataPoints(){
    strokeWeight(5);
    stroke(255,0,0);

    // get the two arrays of interest: depth and magnitude
    depths = table.getColumn("depth");
    magnitudes = table.getColumn("mag").sort();
    latitudes = table.getColumn("latitude");
    longitudes = table.getColumn("longitude");
    places = table.getColumn("place");
    times = table.getColumn("time");

    // get minimum and maximum values for both
    magnitudeMin = 0.0;
    magnitudeMax = getColumnMax("mag");
    // console.log('magnitude range:', [magnitudeMin, magnitudeMax])

    depthMin = 0.0;
    depthMax = getColumnMax("depth");
    // console.log('depth range:', [depthMin, depthMax])

    // cycle through the parallel arrays and add a dot for each event
    for(var i=0; i<magnitudes.length; i++){

        if (magnitudes[i]>=earthquake-0.04 && magnitudes[i]<=earthquake+0.04){
        // create a new dot
        var pal = Brewer.sequential('YlOrRd', 'Infinity', 1, 6)
        var circle = L.circle([latitudes[i], longitudes[i]], {
            color: pal.colorForValue(magnitudes[i]),    // the dot stroke color
            // color:'black',
            weight:20,
            opacity: 0.80,
            fillColor: 'black', // the dot fill color
            fillOpacity: 1,  // use some transparency so we can see overlaps
            radius: 200,
        });

        // var circleCenter = L.circle([latitudes[i], longitudes[i]], {
        //     color:'transparent',
        //     fillColor: 'black', // the dot fill color
        //     radius: 100,
        // });

         // specify popup options 
        var customOptions ={
        'maxWidth': '500',
        'className' : 'custom',
        }

        circle.bindPopup(magnitudes[i] + " earthquake at " + places[i] + " on " + times[i], customOptions).openPopup();

        circle.on('mouseover', function (e) {
            this.openPopup();
        });
        circle.on('mouseout', function (e) {
            this.closePopup();
        });

        // save a reference to the circle for later
        // circleCenters.push(circleCenter);
        circles.push(circle);

         // place it on the map
        // circleCenter.addTo(mymap);
        circle.addTo(mymap);

        }
    }
}

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

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    slider.value()-=0.01;
  } else if (keyCode === RIGHT_ARROW) {
    slider.value()+=0.01;
  }
  return false;
}
