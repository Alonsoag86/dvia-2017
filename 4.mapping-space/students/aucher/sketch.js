// citations: https://github.com/fraxen/tectonicplates
// distance function: http://www.geodatasource.com/developers/javascript

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
var table, tec;

// my leaflet.js map
var mymap;

var canvas;

// max distance from techtonic plate- in kl
var maxDist = 100;

function preload() {
    // load the CSV data into our `table` variable and clip out the header row
    tec = loadJSON('assets/tecMapping.json');
    table = loadTable("assets/all_month.csv", "csv", "header");//, findNearestPlate);
}

function setup() {
    // create your own map
    mymap = L.map('quake-map')
        .setView([51.505, -0.09], 2); // zoom level 2

    // load a set of map tiles (you shouldn't need to touch this)
    L.tileLayer('https://api.mapbox.com/styles/v1/aucher/cj9epjgcw7bqg2smo8k9rodfm/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        minZoom: 0,
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYXVjaGVyIiwiYSI6ImNqODd4NnBndzFjZDQyd3FocnM4Njc2NWQifQ.dql4s6oWRANbYGt44i6n9A'
    }).addTo(mymap);

    L.canvasOverlay()
        .drawing(drawingOnCanvas)
        .addTo(mymap);
    // findNearestPlate();
    // mymap.overlay(canvas);
    // call our function (defined below) that populates the maps with markers based on the table contents
    // drawDataPoints();
    console.log(tec);
    console.log(table);
}

function drawingOnCanvas(canvasOverlay, params){
    var ctx = params.canvas.getContext('2d');
    ctx.clearRect(0,0,params.canvas.width, params.canvas.height);
    // ctx.fillStyle = "rgba(255,116,0, 0.2)";
    ctx.strokeStyle = "rgba(0,0,0, 0.2)";
    for (i in table.rows){
        var d = table.rows[i].obj,
            lat = d.latitude,
            lon = d.longitude;
        // if (params.bounds.contains([lat, lon])) {
            dot = canvasOverlay._map.latLngToContainerPoint([lat, lon]);
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        // console.log(dot);
        // }
    }
}

function findNearestPlate(){

    for (t in table.rows){
        thisEvent = table.rows[t].obj;
        thisEvent.boundary = 'no boundary';
        thisEvent.latitude = +thisEvent.latitude;
        thisEvent.longitude = +thisEvent.longitude;

        for (b in tec){
            if (thisEvent.latitude <= tec[b].maxLat && thisEvent.latitude >= tec[b].minLat
                && thisEvent.longitude <= tec[b].maxLon && thisEvent.longitude >= tec[b].minLon){
                thisEvent.boundary = tec[b].Boundary;
                console.log(thisEvent.boundary);
            }
        }
    }
}

function drawDataPoints(){
    strokeWeight(5);
    stroke(255,0,0);

    // get the two arrays of interest: depth and magnitude
    // depths = table.getColumn("depth");
    // magnitudes = table.getColumn("mag");
    // latitudes = table.getColumn("latitude");
    // longitudes = table.getColumn("longitude");

    // get minimum and maximum values for both
    magnitudeMin = 0.0;
    magnitudeMax = getColumnMax("mag");
    console.log('magnitude range:', [magnitudeMin, magnitudeMax]);

    depthMin = 0.0;
    depthMax = getColumnMax("depth");
    console.log('depth range:', [depthMin, depthMax]);

    // cycle through the parallel arrays and add a dot for each event
    for(i in table.rows){
        thisEvent = table.rows[i].obj;
        // create a new dot
        var circle = L.circle([thisEvent.latitude, thisEvent.longitude], {
            color: getColor(thisEvent.boundary),      // the dot stroke color
            // fillColor: '#ffa625', // the dot fill color
            fillOpacity: 0.25,  // use some transparency so we can see overlaps
            radius: thisEvent.mag * 40000
        }).bindPopup(`lat: ${thisEvent.latitude} lon: ${thisEvent.longitude} bound: ${thisEvent.boundary}`);

        // place it on the map
        circle.addTo(mymap);

        // save a reference to the circle for later
        circles.push(circle)
    }
}

function getColor(b){
    switch (b){
        case 'Juan de Fuca - North America':
            return 'pink';
        case 'Nazca - South America':
            return 'orange';
        case 'Cocos Plate - Caribbean':
            return 'purple';
        case 'Eurasian - Filipino':
            return 'green';
        case 'Pacific - Australian':
            return 'powderblue';
        case 'Eurasian - North America':
            return 'royalBlue';
        default:
            return 'lightGray';
    }
}

function removeAllCircles(){
    // remove each circle from the map and empty our array of references
    circles.forEach(function(circle, i){
        mymap.removeLayer(circle);
    });
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
// // adapted from http://www.geodatasource.com/developers/javascript
// function distance(lat1, lon1, lat2, lon2, unit) {
//     var radlat1 = Math.PI * lat1/180;
//     var radlat2 = Math.PI * lat2/180;
//     var theta = lon1-lon2;
//     var radtheta = Math.PI * theta/180;
//     var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//     dist = Math.acos(dist);
//     dist = dist * 180/Math.PI;
//     dist = dist * 60 * 1.1515;
//     if (unit==="K") { dist = dist * 1.609344 }
//     if (unit==="N") { dist = dist * 0.8684 }
//     return dist
// }
