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

var milliArray = [];
var startTime = performance.now();

var span;

var d1,d2,d3,d4,d5,d6,d7;

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
    createCanvas(800, 100);
    background(200);
    textSize(64);
    Slider = createSlider(0, 200000, 80000);
    Slider.position(20, 600);
    button


    /*
    LEAFLET CODE

    In this case "L" is leaflet. So whenever you want to interact with the leaflet library
    you have to refer to L first.
    so for example L.map('mapid') or L.circle([lat, long])
    */

    // create your own map
    mymap = L.map('quake-map').setView([34.0522, 10.2437], 2);

    // load a set of map tiles (you shouldn't need to touch this)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: 'pk.eyJ1IjoiZHZpYTIwMTciLCJhIjoiY2o5NmsxNXIxMDU3eTMxbnN4bW03M3RsZyJ9.VN5cq0zpf-oep1n1OjRSEA'
    }).addTo(mymap);




    // call our function (defined below) that populates the maps with markers based on the table contents
    
    console.log("start time: ", startTime);
    printTimes();
    lengthTime();
    console.log("milliArray length: ",milliArray.length);
    console.log("milliArray: ",milliArray);
    console.log("span: ",span);
    currentTime();
    drawDataPoints();

    

}

function mouseClicked(){
    removeAllCircles();
    drawDataPoints();
}



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

function currentTime(){
    current=(performance.now()/50000);
    // for (var i = 0; i < lengthTime(); i++) {
    //     // console.log(i);
    // }
    // console.log(lengthTime());
    // for (var i = 0; i < milliArray[length-1]; i++) {
    // var now = performance.now();
    // var elapsed = Math.round(now - startTime);  
    // return elapsed; 
    // }
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}




function drawDataPoints(){

    // get the two arrays of interest: depth and magnitude
    depths = table.getColumn("depth");
    magnitudes = table.getColumn("mag");
    latitudes = table.getColumn("latitude");
    longitudes = table.getColumn("longitude");

    // get minimum and maximum values for both
    magnitudeMin = 0.0;
    magnitudeMax = getColumnMax("mag");
    // console.log('magnitude range:', [magnitudeMin, magnitudeMax])

    depthMin = 0.0;
    depthMax = getColumnMax("depth");
    // console.log('depth range:', [depthMin, depthMax, depths.length])


    var c1 = "#fef0d9";
    var c2 = "#fdd49e";
    var c3 = "#fdbb84";
    var c4 = "#fc8d59";
    var c5 = "#ef6548";
    var c6 = "#d7301f";
    var c7 = "#990000";


    for(var i=0; i<depths.length;i++){
    drawC1(i);
    drawC2(i);
    drawC3(i);
    drawC4(i);
    drawC5(i);
    drawC6(i);
    drawC7(i);
    }

    function drawC1(i){
    if (i>0 && i<3) {
            createCircle(i, c1);
        }
    }


    function drawC2(i){
    if (i>3 && i<3.9) {
            createCircle(i, c2);
        }
    }


    function drawC3(i){
    if (i>4 && i<4.9) {
            createCircle(i, c3);
        }
    }

    function drawC4(i){
    if (i>5 && i<5.9) {
            createCircle(i, c4);
        }
    }

    function drawC5(i){
    if (i>6 && i<6.9) {
            createCircle(i, c5);
        }
    }

    function drawC6(i){
    if (i>7 && i<7.9) {
            createCircle(i, c6);
        }
    }

    function drawC7(i){
    if (i>8) {
            createCircle(i, c7);
        }
    }


    // var d1 = drawC1();
    // var d2 = drawC2(); 
    // var d3 = drawC3();
    // var d4 = drawC4();
    // var d5 = drawC5();
    // var d6 = drawC6();
    // var d7 = drawC7();
    // cycle through the parallel arrays and add a dot for each event
    // for(var i=0; i<depths.length;i++){

    //     if (magnitudes[i]>0 && magnitudes[i]<3) {
    //         createCircle(i, c1);
    //     } else {
    //         if (magnitudes[i]>3 && magnitudes[i]<3.9) {
    //         createCircle(i, c2); 
    //     } else {
    //         if (magnitudes[i]>4 && magnitudes[i]<4.9) {
    //             createCircle(i,c3);
    //         } else {
    //             if (magnitudes[i]>5 && magnitudes[i]<5.9) {
    //                 createCircle(i,c4);
    //             } else {
    //                 if (magnitudes[i]>6 && magnitudes[i]<6.9) {
    //                     createCircle(i,c5);
    //                 } else {
    //                     if (magnitudes[i]>7 && magnitudes[i]<7.9) {
    //                         createCircle(i,c6);
    //                     } else {
    //                         if (magnitudes[i]>8 ) {
    //                             createCircle(i,c7);
    //                         } else {}
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     }
        
    
}

function createCircle(i,color){
// create a new dot
          var s = Slider.value();
          magnitudeValue = magnitudes[i]*50;
          
            var circle = L.circle([latitudes[i], longitudes[i]], {
            stroke: 0,
            fillColor: (color), // the dot fill color
            fillOpacity: 0.5,  // use some transparency so we can see overlaps
            radius: s,
        });
            // circle.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
            circle.bindTooltip("Magnitude: "+ magnitudes[i]).openTooltip();
            // place it on the map
        circle.addTo(mymap);

        // save a reference to the circle for later
        circles.push(circle)
        
        

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

