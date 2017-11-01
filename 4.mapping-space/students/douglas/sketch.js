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


Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
function getDivColor(val) {
 return val > 7  ? '#b2182b' :
        val > 6  ? '#d6604d' : 
	val > 5  ? '#f4a582' :
	val > 4  ? '#fddbc7' :
	val > 3  ? '#d1e5f0' :
	val > 2  ? '#92c5de' :
	val > 1  ? '#4393c3' :
	val > 0  ? '#2166ac' :
	           '#2166ac' ;
}

//var num = 5;
//console.log(num.map(-20, 0, -100, 100)); // 150

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
    createCanvas(800, 200);
    colorMode(HSB,360,100,100);
    background(10);
    textSize(10);
    noStroke();  // Don't draw a stroke around shapes
    //text("test☃", 18, 72);
    //legend
    for(var j=1; j<9; j++){
    	var lc = getDivColor(j);
    	fill(lc);  // Use 'c' as fill color
	console.log('j: ', j);
	console.log('Fill color: ', lc);
    	rect((j*30), 30, 30, 30);  // Draw rectangle
    }
    fill(100);
    textSize(12);
    text("Magnitude", 30,20);
    textSize(10);
    text("12", 240, 80);
    text("11", 210, 80);
    text("10", 180, 80);
    text("8", 150, 80);
    text("6", 120, 80);
    text("4", 90, 80);
    text("2", 60, 80);
    text("0", 30, 80);

    /*
    LEAFLET CODE

    In this case "L" is leaflet. So whenever you want to interact with the leaflet library
    you have to refer to L first.
    so for example L.map('mapid') or L.circle([lat, long])
    */

    // create your own map
    //  40.7128° N, 74.0060° W
    mymap = L.map('quake-map').setView([40.7128, -74.0060], 3);

    // load a set of map tiles (you shouldn't need to touch this)
    //http[s]://cartodb-basemaps-{s}.global.ssl.fastly.net/{style}/{z}/{x}/{y}.png/
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        //id: 'mapbox.light',
        id: 'mapbox.dark',
        accessToken: 'pk.eyJ1IjoiZHZpYTIwMTciLCJhIjoiY2o5NmsxNXIxMDU3eTMxbnN4bW03M3RsZyJ9.VN5cq0zpf-oep1n1OjRSEA'
    }).addTo(mymap);


    //doug added layers
    //
    //
    //
    //
    //
    //
    /*
        id: 'mapbox.ets',
    var grayscale = L.tileLayer(mapboxUrl, {id: 'MapID', attribution: mapboxAttribution}),
        streets   = L.tileLayer(mapboxUrl, {id: 'MapID', attribution: mapboxAttribution});

    var map = L.map('map', {
	        center: [39.73, -104.99],
		    zoom: 10,
		        layers: [grayscale, cities]
    });
    var baseMaps = {
	        "Grayscale": grayscale,
		    "Streets": streets
    };

    var overlayMaps = {
	        "Cities": cities
    };

    //L.control.layers(baseMaps, overlayMaps).addTo(map);
    */
    // call our function (defined below) that populates the maps with markers based on the table contents
    drawDataPoints();
}

function drawDataPoints(){
    strokeWeight(5);
    stroke(255,0,0);

    // get the two arrays of interest: depth and magnitude
    depths = table.getColumn("depth");
    magnitudes = table.getColumn("mag");
    latitudes = table.getColumn("latitude");
    longitudes = table.getColumn("longitude");
    places = table.getColumn("place");

    // get minimum and maximum values for both
    magnitudeMin = 0.0;
    magnitudeMax = getColumnMax("mag");
    //console.log('magnitude range:', [magnitudeMin, magnitudeMax])

    depthMin = 0.0;
    depthMax = getColumnMax("depth");
    //console.log('depth range:', [depthMin, depthMax])

    // cycle through the parallel arrays and add a dot for each event
    for(var i=0; i<depths.length; i++){
        // create a new dot
	if (depths[i] = magnitudeMax) {
           var mark = L.marker([latitudes[i], longitudes[i]])
           };

       var num = parseFloat(magnitudes[i]);
       //var num = magnitudes[i];
       //var num = magnitudeMax;
       //console.log(num.map(magnitudeMin, magnitudeMax, 0, 8)); // 150
       var dotcolor = getDivColor(num.map(magnitudeMin, magnitudeMax, 0, 8)); 



        var circle = L.circle([latitudes[i], longitudes[i]], {
            //function getDivColor(val) {
            color: dotcolor,      // the dot stroke color
            fillColor: dotcolor, // the dot fill color
            fillOpacity: 0.75,  // use some transparency so we can see overlaps
            radius: 1
            //radius: magnitudes[i] * 40000
        });

	//mark.bindPopup(place[i]).openPopup();
	//strPop = concat("Mag: ", magnitudes[i], " ", places[i]);
	strPop1 = concat("Mag: ", magnitudes[i])
	strPop2 = concat(strPop1, "<br>");
	strPop3 = concat(strPop2, places[i]);
	//console.log(strPop3);
	//strPop = "hYei";
	circle.bindPopup(strPop3);
        // place it on the map
	//mark.bindPopup(place[i]).openPopup();
	mark.bindPopup("Largest Mag").openPopup();
        circle.addTo(mymap);

        // save a reference to the circle for later
        circles.push(circle)
    }
	mark.addTo(mymap);
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
    // jj
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
