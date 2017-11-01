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

// table as the data set
var table;

// my leaflet.js map
var mymap;

var milliArray = [];

var span;

var d1,d2,d3,d4,d5,d6,d7;

var button;

var s = 30000;

var lo, hi;

var io = 0;

var lohiArray = [];

var buttons = {All:false, Minor:false, Light:false, Moderate:false, Strong:false, Major:false, Great:false};

var colorArray = ["#fef0d9",,,"#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"];


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
    noLoop();
    createCanvas(window.innerWidth,200);
    background("#1E1E1E");
    textSize(64);
    Slider = createSlider(0, 500000, 30000);
    var centerWidth = ((window.innerWidth/2) - (Slider.width/2));
    var SliderHeight = (window.innerHeight*.8)
    Slider.position(centerWidth, SliderHeight);
    s = Slider.value();

    /*
    LEAFLET CODE

    In this case "L" is leaflet. So whenever you want to interact with the leaflet library
    you have to refer to L first.
    so for example L.map('mapid') or L.circle([lat, long])
    */

    // create your own map
    mymap = L.map('quake-map').setView([34.0522, 10.2437], 3);

    // load a set of map tiles (you shouldn't need to touch this)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: 'pk.eyJ1IjoiZHZpYTIwMTciLCJhIjoiY2o5NmsxNXIxMDU3eTMxbnN4bW03M3RsZyJ9.VN5cq0zpf-oep1n1OjRSEA'
    }).addTo(mymap); 

    // call our function (defined below) that populates the maps with markers based on the table contents
    
    // drawDataPoints();

}


// function radius(){
//         color(255);
//         ellipse(20, 700, 500,500);
        
//     }
//     radius();


function printTimes(){
    time = table.getColumn("time");
    for (var i = 0; i < time.length; i++) {
        var milli = Date.parse(time[i]);
        var zero = Date.parse(time[0]);
        var fromZero = Math.round((zero - milli)/50000);
        milliArray.push(fromZero);
    }
}

function lengthTime(){
    length = milliArray.length;
    last = milliArray[length-1];
    first = milliArray[0];
    span = Math.round((last - first));
    return span;
}

function sortMag(){
}

function binary(id,value){
    var x = id;
    var y = value;
    var t_x = "t_"+id;
        if (y == "true"){
        document.getElementById(x).style.outline = "0px solid #000";
        document.getElementById(x).value = false;
        document.getElementById(t_x).style.textDecoration = "none";
            if (x == "All"){
                clearSelection();
            }
        } 
        else{
                        if (x == "All"){
                clearSelection();
            }
        document.getElementById(x).style.color = "black";
        document.getElementById(x).style.outline = "3px dashed #000";
        document.getElementById(x).style.outlineOffset = "-3px";
        document.getElementById(x).value = true;
        document.getElementById(t_x).style.textDecoration = "underline";
        }

    
    drawCycle();
    // console.log(document.getElementById("id").value);

}

function clearSelection(){

}
// function mousePressed(){
//     console.log(io);
// }

function drawCycle(){
    circles.forEach(function(circle, i){
        mymap.removeLayer(circle);
    })
    circles = [];
    console.log(document.getElementById("All").value);
    if(document.getElementById("All").value == "true"){
        masterCircle(0,100);
        masterCircle(3,3.9);
        masterCircle(4,4.9);
        masterCircle(5,5.9);
        masterCircle(6,6.9);
        masterCircle(7,7.9);
        masterCircle(8,100);
    }

    if(document.getElementById("Minor").value == "true"){
        masterCircle(3,3.9);
    }

    if(document.getElementById("Light").value == "true"){
        masterCircle(4,4.9);  
    }

    if(document.getElementById("Moderate").value == "true"){
        masterCircle(5,5.9);
    }

    if(document.getElementById("Strong").value == "true"){
        masterCircle(6,6.9);
    }

    if(document.getElementById("Major").value == "true"){
        masterCircle(7,7.9);
    }

    if(document.getElementById("Great").value == "true"){
        masterCircle(8,100);
    }
}


function masterCircle(lo,hi){

    // get the two arrays of interest: depth and magnitude
    depths = table.getColumn("depth");
    magnitudes = table.getColumn("mag");
    latitudes = table.getColumn("latitude");
    longitudes = table.getColumn("longitude");
    place = table.getColumn("place");

    // get minimum and maximum values for both
    magnitudeMin = 0.0;
    magnitudeMax = getColumnMax("mag");
    // console.log('magnitude range:', [magnitudeMin, magnitudeMax])

    depthMin = 0.0;
    depthMax = getColumnMax("depth");
    // console.log('depth range:', [depthMin, depthMax, depths.length])
    
    var c = 1;

    for(var i=0; i<magnitudes.length;i++){

        if (magnitudes[i]>lo && magnitudes[i]<hi) {
            createCircle(i, lo)
        }  

    }


    function createCircle(i,lo){
    // create a new dot
        var s = Slider.value();

        var circle = L.circle([latitudes[i], longitudes[i]], {
            stroke: 0,
            fillColor: (colorArray[lo]), // the dot fill color
            fillOpacity: 0.5,  // use some transparency so we can see overlaps
            radius: s,
        });
            // circle.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
        // circle.bindTooltip("Magnitude: "+ magnitudes[i]).openTooltip();
            // place it on the map
        var text = "<dl><dt>Location: " + place[i] + "</dt>"
                + "<dd>Magnitude: " + magnitudes[i] + "</dd>"
        circle.bindPopup(text).openPopup();
        circle.addTo(mymap);

        // save a reference to the circle for later
        circles.push(circle)
        
    }

    lohiArray = [];
    lohiArray.push(lo,hi);


}

// console.log(lohiArray[0]);

// console.log(hi);

function mouseDragged(){
    drawCycle();
    // masterCircle(lohiArray[0],lohiArray[1]);
}
//     function minor(i){
// // create a new dot
//           var s = Slider.value();
//           magnitudeValue = magnitudes[i]*50;
//           mappedValue = map(i,0,magnitudes.length,0,255);
//           hexColor = rgbToHex(mappedValue,mappedValue,255)
//           var d = mappedValue;
//           var c = hexColor;

//             var circle = L.circle([latitudes[i], longitudes[i]], {
//             stroke: 0,
//             fillColor: c, // the dot fill color
//             fillOpacity: 1,  // use some transparency so we can see overlaps
//             radius: s,
//         });
//             // circle.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
//             circle.bindTooltip(magnitudes[i]).openTooltip();
//             // place it on the map
//         circle.addTo(mymap);

//         // save a reference to the circle for later
//         circles.push(circle)
        
//         }

//     }

function clearSelection(){
    delete buttons.passId;
    var keyNames = Object.keys(buttons);
    for (var i in keyNames) {
        var t_keyNames= "t_"+(keyNames[i]);
    document.getElementById(keyNames[i]).style.outline = "0px solid #000";
    document.getElementById(t_keyNames).style.textDecoration = "none";

    buttons = {All:false, Minor:false, Light:false, Moderate:false, Strong:false, Major:false, Great:false};
    removeAllCircles();
}

function removeAllCircles(){
    // remove each circle from the map and empty our array of references
    circles.forEach(function(circle, i){
        mymap.removeLayer(circle);
    })
    circles = [];
}
    
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

