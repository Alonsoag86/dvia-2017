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

function preload() {
    // load the CSV data into our `table` variable and clip out the header row
    table = loadTable("assets/all_month.csv", "csv", "header");
    table = loadTable("assets/significant_month.csv", "csv", "header");
}

// CIE LAB colors from http://davidjohnstone.net/pages/lch-lab-colour-gradient-picker
magColors = [ "#fceabb", "#ffdfaf", "#ffd4a2", "#ffc996", "#ffbd8a", "#ffb27e", "#ffa672", "#ff9a67", "#ff8e5b", "#ff824f", "#ff7444", "#ff6638", "#ff572c", "#ff4620", "#ff2f12", "#ff0000"];

function setup() {
    /*
    P5 SETUP

    If you want to draw some diagrams to complement the map view, set up your canvas
    size, color, etc. here
    */
    createCanvas(100, 100);
    background(200);
    textSize(64);
    text("☃", 18, 72);

    /*
    LEAFLET CODE

    In this case "L" is leaflet. So whenever you want to interact with the leaflet library
    you have to refer to L first.
    so for example L.map('mapid') or L.circle([lat, long])
    */

    // create your own map
    mymap = L.map('quake-map').setView([20.505, 15], 2);

    // load a set of map tiles (you shouldn't need to touch this)
    //L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        //attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        //maxZoom: 18,
        //id: 'mapbox.streets',
        //accessToken: 'pk.eyJ1IjoiZHZpYTIwMTciLCJhIjoiY2o5NmsxNXIxMDU3eTMxbnN4bW03M3RsZyJ9.VN5cq0zpf-oep1n1OjRSEA'
    //}).addTo(mymap);
    
    //L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	    //attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	    //maxZoom: 16
    //}).addTo(mymap);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }).addTo(mymap);
    
    // call our function (defined below) that populates the maps with markers based on the table contents
    drawDataPoints();
}

var properties = {
  colorId: "green"
}

   
function drawDataPoints(){
    strokeWeight(5);
    stroke(255,0,0);

    // get the two arrays of interest: depth and magnitude
    depths = table.getColumn("depth");
    magnitudes = table.getColumn("mag");
    latitudes = table.getColumn("latitude");
    longitudes = table.getColumn("longitude");
    durations = table.getColumn("dmin");

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
        var circle = L.circle([latitudes[i], longitudes[i]], {
            color: 'red',      // the dot stroke color
            fillColor: '#f03', // the dot fill color
            fillOpacity: 0.25,  // use some transparency so we can see overlaps
            radius: magnitudes[i] * 40000
        });
        
        var magC = parseInt(magnitudes[i]/.5)
        properties.colorId = magColors[magC]; 
        

         const markerHtmlStyles = `
          background-color: ${properties.colorId || '#583470'};
          width: 1.5rem;
          height: 1.5rem;
          display: block;
          left: -1.5rem;
          top: -1.5rem;
          position: relative;
          opacity: 0.8;
          border-radius: 3rem 3rem 0;
          transform: rotate(45deg);
          mwborder: 1px solid #FFFFFF`

        const myicon = L.divIcon({
          className: "x",
          iconAnchor: [0, 24],
          labelAnchor: [-6, 0],
          popupAnchor: [0, -36],
          html: `<span class="mwMarker" style="${markerHtmlStyles}" />`
        })
        
        
        var m = L.marker([latitudes[i], longitudes[i]], {riseOnHover:true, icon:myicon});
        
        
        Number.prototype.map = function (in_min, in_max, out_min, out_max) {
          return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
        }  
        
        m.on('mouseover', function(e) {
          //alert("asdf");
          var coords = mymap.latLngToContainerPoint(this._latlng);
          $(".donut").css("display", "inline");
          $(".donut").css("position", "absolute");
          $(".donut").css("left", coords["x"]-37);
          $(".donut").css("top", coords["y"]-59);
          $(".donut").css("z-index", "400");
          $(".donut").css("transform", "translate(-10, -20)");
          var curIdx = latitudes.indexOf(str(this._latlng["lat"]));
          dur = parseFloat(durations[curIdx]);
          dur = Math.ceil(dur);
          console.log(dur)
          scaledDur = dur.map(1, 20, 80, 0);
          $(".donut-segment").attr("stroke-dashoffset", scaledDur);
          
        
    //open popup;
    //var popup = L.popup()                  marker.valueOf()._icon.style.backgroundColor = 'green'
      //.setLatLng(e.latlng) 
   //.setContent('Popup')
   //.openOn(map);
        });
        m.on('mouseout', function(e) {
          $(".donut").css("display", "none");
        });
          
        // place it on the map
        // circle.addTo(mymap);
        m.addTo(mymap);

        // save a reference to the circle for later
        // circles.push(circle)
    }
    
    //$(".mwMarker").click(function() {
      //alert("test");
      //});
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
