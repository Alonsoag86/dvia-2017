// an array for the magnitude
var magnitudes;
// an array for depth
var depths;
// an array for lat & long
var latitudes, longitudes;
var times, places;

// minimum and maximum values for magnitude and depth
var magnitudeMin, magnitudeMax;
var depthMin, depthMax;

// the dots we'll be adding to the map
var circles = [];
var heatPoints = [];

// table as the data set
var table;

// my leaflet.js map
var mymap;

function preload() {
    // load the CSV data into our `table` variable and clip out the header row
    table = loadTable("assets/all_month.csv", "csv", "header");
    heatTable = loadTable("assets/all_month.csv", "csv", "header");
}

function setup() {
    /*
    P5 SETUP

    If you want to draw some diagrams to complement the map view, set up your canvas
    size, color, etc. here
    */
    createCanvas(800, 600);
    textSize(64);
    textAlign(CENTER);
    // Slider = createSlider(0, 31, 31, 1);
    // Slider.position(windowWidth/3, windowHeight-60);
    // text("Time", 500, 710);
    // Slider.style('width', '400px');
    
    writeHeatData(heatTable);
    console.log(heatPoints)
    var testData = {
      max: 50,
      min: -3.26,
      data: heatPoints
    };

    var baseLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 5,
      minZoom:1,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiZHZpYTIwMTciLCJhIjoiY2o5NmsxNXIxMDU3eTMxbnN4bW03M3RsZyJ9.VN5cq0zpf-oep1n1OjRSEA'
    })

    var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        "maxOpacity": .8,
        "minOpacity":.03,
        // scales the radius based on map zoom
        "scaleRadius": true, 
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries 
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": false,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        gradient: {
              '0.25': 'Blue',
              '0.50': 'Purple',
              '0.75': "Red",
              '0.95': 'Yellow'
            }
      };


    var heatmapLayer = new HeatmapOverlay(cfg);

    mymap = new L.Map('quake-map', {
        center: new L.LatLng(61.505, -150.09),
        zoom: 2,
        layers: [baseLayer, heatmapLayer]
    });

    // L.control.layers(baseLayer, heatmapLayer).addTo(map);

    heatmapLayer.setData(testData);

    // make accessible for debugging
    layer = heatmapLayer;

    times = table.getColumn("time");
    var date = new Date("2017-09-25");
    console.log(date);
    //drawDataPoints();
}

function writeHeatData(data){
    magnitudes = data.getColumn("mag");
    latitudes = data.getColumn("latitude");
    longitudes = data.getColumn("longitude");
    depths = table.getColumn("depth");

    console.log(latitudes[3]);

    for(var i = 0; i<latitudes.length; i++){
         var heatData = new Object();
         heatData.lat = latitudes[i];
         heatData.lng = longitudes[i];
         if(magnitudes[i] > 0){
            heatData.radius = magnitudes[i];
        } else{
            heatData.radius = 0;
        }
        heatData.value = depths[i] * 10;
        heatPoints.push(heatData);

    }
    console.log(heatPoints[3])

}

function drawDataPoints(){
    strokeWeight(5);
    stroke(255,0,0);

    // get the two arrays of interest: depth and magnitude
    depths = table.getColumn("depth");
    magnitudes = table.getColumn("mag");
    latitudes = table.getColumn("latitude");
    longitudes = table.getColumn("longitude");
    times = table.getColumn("time");
    details = table.getColumn("place");

    // get minimum and maximum values for both
    magnitudeMin = 0.0;
    magnitudeMax = getColumnMax("mag");
    console.log('magnitude range:', [magnitudeMin, magnitudeMax])

    depthMin = 0.0;
    depthMax = getColumnMax("depth");
    console.log('depth range:', [depthMin, depthMax])

    // cycle through the parallel arrays and add a dot for each event
    for(var i=0; i<depths.length; i++){
        if(magnitudes[i] > 6){
        // create a new dot
            var circle = L.circleMarker([latitudes[i], longitudes[i]], {
                color: 'black',      // the dot stroke color
                fillColor: '#f03', // the dot fill color
                fillOpacity: 0.25,  // use some transparency so we can see overlaps
                radius: 5,
            });
            // place it on the map
            circle.addTo(mymap);

            // save a reference to the circle for later
            circles.push(circle)
        }
    }

}

function getColumnMax(columnName){
    // get the array of strings in the specified column
    var colStrings = table.getColumn(columnName);

    // convert to a list of numbers by running each element through the `float` function
    var colValues = _.map(colStrings, float);

    // find the max value by manually stepping through the list and replacing `m` each time we
    // encounter a value larger than the biggest we've seen so far
    // var m = 0.0;
    // for(var i=0; i<colValues.length; i++){
    //     if (colValues[i] > m){
    //         m = colValues[i];
    //     }
    // }
    // return m;

    // or do it the 'easy way' by using lodash:
    return _.max(colValues);

function getColumnMin(columnName){
     var colStrings = table.getColumn(columnName);
     var colValues = _.map(colStrings, float);

     return _.min(colValues);
}


function removeAllCircles(){
    // remove each circle from the map and empty our array of references
    circles.forEach(function(circle, i){
        mymap.removeLayer(circle);
    })
    circles = [];
}
}

function draw(){
}

