// an array for the magnitude
var magnitudes;
// an array for depth
var depths;
// an array for lat & long
var latitudes, longitudes;

// minimum and maximum values for magnitude and depth
var magnitudeMin, magnitudeMax;
var depthMin, depthMax;

var place;

// the dots we'll be adding to the map
var circles = [];
var recents = [];

// table as the data set
var table;

// my leaflet.js map
var mymap;



function preload() {
    // load the CSV data into our `table` variable and clip out the header row
    table = loadTable("assets/all_month.csv", "csv", "header");
}

function setup() {
  
    depths = table.getColumn("depth");
    magnitudes = table.getColumn("mag");
    latitudes = table.getColumn("latitude");
    longitudes = table.getColumn("longitude");
    place = table.getColumn("place");
    times = table.getColumn("time");

    // get minimum and maximum values for both
    magnitudeMin = 0.0;
    magnitudeMax = getColumnMax("mag");
    console.log('magnitude range:', [magnitudeMin, magnitudeMax])

    depthMin = 0.0;
    depthMax = getColumnMax("depth");
    console.log('depth range:', [depthMin, depthMax]);

    for(var i=0; i<depths.length; i++){
        // create a new dot
        var circle = L.circle([latitudes[i], longitudes[i]], {
            color: getFillColor(circle),  
            fillColor: getFillColor(circle),
            fillOpacity: 1,  // use some transparency so we can see overlaps
            radius: 100 * 100,
            //bubblingMouseEvents: true,
            stroke: true,
            weight: magnitudes[i] * magnitudes[i] * 2,
            opacity: .05
            } 
        );   
       circle.bindPopup("<b>" + place[i] + "</b>" + "</br>" + "Magnitude " + magnitudes[i] + "</br>"+ "Intensity Level " + intensityLevel(magnitudes[i]) + "</br>" + "</br>" + "<em>" + formatTime(times[i]) + "</em>");

       circles.push(circle);
       var date = new Date(times[i]);
       var theDay = date.getDate();
       var theMonth = date.getMonth() + 1;
       var theDate = 31 - theDay;

       if (theDate + day() <= 7 && theMonth == month() - 1 || theMonth == month()) {
       recents.push(circle);       
        } 
    }

function getFillColor(circle) {
    if  (magnitudes[i] <= 3.0) {    // the dot stroke color
            return '#fdd49e'
            } else if  (magnitudes[i] > 3.0 && magnitudes[i] <= 3.9) {
            return '#fdbb84'
            } else if  (magnitudes[i] >= 4.0 && magnitudes[i] <= 4.9) {
            return '#fc8d59'
            } else if  (magnitudes[i] >= 5.0 && magnitudes[i] <= 5.9) {
            return '#ef6548'
            } else if  (magnitudes[i] >= 6.0 && magnitudes[i] <= 6.9) {
            return '#d7301f'
            } else  if  (magnitudes[i] > 6.9) {
            return '#990000'
            }
};

function intensityLevel(mag) {
    if (mag <= 3.0) {    // the dot stroke color
            return 'I'
            } else if  (mag > 3.0 && mag <= 3.9) {
            return 'II-III'
            } else if  (mag >= 4.0 && mag <= 4.9) {
            return 'IV-V'
            } else if  (mag >= 5.0 && mag <= 5.9) {
            return 'VI-VII'
            } else if  (mag >= 6.0 && mag <= 6.9) {
            return 'VII-IX'
            } else  if  (mag > 6.9) {
            return 'VII or higher'
            }
};

function formatTime(d) {
    var date = new Date(d);
    return date.toLocaleString();

}


var recentquakes = L.layerGroup(recents);
var earthquakes = L.layerGroup(circles);
    // create your own map
    mymap = L.map('quake-map', {
        center: [51.505, -0.09], 
        zoom: 2,
        layers: [earthquakes, recentquakes]
    });
   
    // load a set of map tiles (you shouldn't need to touch this)
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
    //L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        minZoom: 2,


        //id: 'mapbox.streets',
       // accessToken: 'pk.eyJ1IjoiZHZpYTIwMTciLCJhIjoiY2o5NmsxNXIxMDU3eTMxbnN4bW03M3RsZyJ9.VN5cq0zpf-oep1n1OjRSEA'
    }).addTo(mymap);

   

    var overlayMaps = {
        "7 Day Activity": recentquakes,
        "30 Day Activity": earthquakes
        };

    L.control.layers(overlayMaps).addTo(mymap);

       

function getColor(d) {
    return d > 7.0 ? '#990000' :
           d > 6.0  ? '#d7301f' :
           d > 5.0  ? '#ef6548' :
           d > 4.0  ? '#fc8d59' :
           d > 3.0   ? '#fdbb84' :
           d > 1.0   ? '#fdd49e' :
                      '#FED976' 
}




var legend = L.control({position: 'topright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        intensity = [1.0, 3.0, 4.0, 5.0, 6.0, 7.0],
        labels = ['I', 'II-III', 'IV-V', 'VI-VII', 'VII-IX', 'VIII or higher'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < intensity.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(intensity[i] + 1) + '"></i> ' + "Magnitude " +
            intensity[i] + (intensity[i + 1] ? '&ndash;' + intensity[i + 1] + " = Intensity Level " + labels[i] + '<br>' : '+' + ' = VIII or higher');
    }

    return div;
};

legend.addTo(mymap);


    // call our function (defined below) that populates the maps with markers based on the table contents
    //addInfo();
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
