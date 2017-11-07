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

// dimension variables for timeline sketch and canvas
var hght = 300;
var wdth = 1200;
var ymargin = hght/15;
var xmargin = wdth/20;
var zeroy = hght/10;
var zerox = wdth/10;
var ell;

// my leaflet.js map
var mymap;

var val;

function preload() {
    // load the CSV data into our `table` variable and clip out the header row
    table = loadTable("assets/significant_month.csv", "csv", "header");
}

function setup() {
    /*
    P5 SETUP

    If you want to draw some diagrams to complement the map view, set up your canvas
    size, color, etc. here
    */
    // textSize(64);
    // text("☃", 18, 72);
    // createCanvas(wdth,50);
    // magslider = createSlider(0,7,7,0.01);
    // magslider.position(width/2,25);
    val = 7;
    magslider = createSlider(0,7,val,0.01);
    magslider.position(wdth/2,600);
    sortedtime = sort(table.getColumn("time"));
    rowcount = table.getRowCount();

    /*
    LEAFLET CODE

    In this case "L" is leaflet. So whenever you want to interact with the leaflet library
    you have to refer to L first.
    so for example L.map('mapid') or L.circle([lat, long])
    */

    // create your own map
    mymap = L.map('quake-map').setView([51.505, -0.09], 1);

    // load a set of map tiles (you shouldn't need to touch this)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoiZHZpYTIwMTciLCJhIjoiY2o5NmsxNXIxMDU3eTMxbnN4bW03M3RsZyJ9.VN5cq0zpf-oep1n1OjRSEA'
    }).addTo(mymap);


    // call our function (defined below) that populates the maps with markers based on the table contents
    drawDataPoints();
}

function draw() {
  val = magslider.value();
  removeAllCircles();
  drawDataPoints();
  timelinesketch();
}

function timelinesketch() {
  createCanvas(wdth,hght);
  background(240);
  stroke(0);
  line(xmargin+zerox,ymargin+zeroy,wdth-xmargin-zerox,ymargin+zeroy);

  strokeWeight(3);
  //width
  // xdiff = (wdth-(2*xmargin)-(2*zerox))/(rowcount-1);
  // console.log(rowcount);
  // console.log(xdiff);

  //get max and mix depths
  maxd = table.getNum(0,"depth");
  mind = table.getNum(0,"depth");

  function getmaxdepth() {
    if (table.getNum(r,"depth") > maxd) {
      maxd = table.getNum(r,"depth")
    }
    return maxd
  };
  function getmindepth() {
    if (table.getNum(r,"depth") < mind) {
      mind = table.getNum(r,"depth")
    }
    return mind
  };

  for (r=0;r<rowcount;r++) {
    getmindepth();
    getmaxdepth();
  }


  var maxy = hght - ymargin - (zeroy/2);
  var miny = ymargin + (zeroy/2);
  var ydiff = (maxy-miny)/(maxd-mind);
  var magscale = 3;

  // console.log(sortedtime);
  stroke(0,0,0,150);
  for (t=0;t<sortedtime.length;t++) {
    for (r=0;r<rowcount;r++) {
      if (sortedtime[t] === table.get(r,"time")) {
        if (table.get(r,"mag") >= val) {
          fill(255,255,255,150);
          //console.log(Date(table.get(r,"time")));
          var rdate = new Date(sortedtime[t]);
          var maxdate = new Date(table.get(0,"time"));
          var mindate = new Date(sortedtime[0]);
          var totdatediff = (maxdate - mindate);
          var xdifftime = (wdth-(2*xmargin)-(2*zerox))/(totdatediff);
          var rdatediff = (rdate - mindate);
          // console.log(rdatediff);
          var x = xmargin+zerox+(xdifftime*(rdatediff));
          var y = ymargin+zeroy+(table.getNum(r,"depth")*ydiff);
          var diam = (table.getNum(r,"mag")-2)*magscale;
          var rad = diam/2;
          var rand = Math.pow(1.2,table.getNum(r,"mag"));
          if (mouseX <= x+rad && mouseX >= x-rad && mouseY <= y+rad && mouseY >= y-rad) {
            ellipse(x+random(-rand,rand),y+random(-rand,rand),diam);
            strokeWeight(0.1);
            if(table.getNum(r,"depth")<0) {
              line(x,y+(diam/2),x,ymargin+zeroy);
            } else if(table.getNum(r,"depth")===0) {
              line(x,y,x,y);
            } else {
              line(x,ymargin+zeroy,x,y-(diam/2));
            };
            strokeWeight(0);
            textStyle(BOLD);
            fill(0);
            text(table.getString(r,"time"),wdth/2,ymargin/3);
            text(table.getString(r,"place"),wdth/2,2*ymargin/3);
            text("Depth: "+table.getString(r,"depth") + "km, Mag:"+table.getString(r,"mag")+table.getString(r,"magType"),wdth/2,ymargin);
            fill(255,255,255,150);
            drawHighlightedCircle(r);
            fill(255,255,255,150);
          } else {
            ellipse(x,y,diam);
            strokeWeight(0.1);
            if(table.getNum(r,"depth")<0) {
              line(x,y+(diam/2),x,ymargin+zeroy);
            } else if(table.getNum(r,"depth")===0) {
              line(x,y,x,y);
            } else {
              line(x,ymargin+zeroy,x,y-(diam/2));
            };
          };
          strokeWeight(3);
        }
      }
    }
  };

  // if (mouseX <= wdth-2*xdiff+(xdiff/2) && mouseX >= wdth-2*xdiff-(xdiff/2) && mouseY <= hght-(xdiff/2)-5+(xdiff/24) && mouseY >= hght-(xdiff/2)-5-(xdiff/24)) {
  //   ellipse(wdth-2*xdiff+random(-Math.pow(1.5,3),Math.pow(1.5,3)),hght-(xdiff/2)-5+random(-Math.pow(1.5,3),Math.pow(1.5,3)),magscale);
  // } else {
  //   ellipse(wdth-2*xdiff,hght-(xdiff/2)-5,magscale);
  // };
  //
  //
  // if (mouseX <= wdth-xdiff+(xdiff/2) && mouseX >= wdth-xdiff-(xdiff/2) && mouseY <= hght-5 && mouseY >= hght-5-xdiff) {
  //   ellipse(wdth-xdiff+random(-Math.pow(1.5,9),Math.pow(1.5,9)),hght-(xdiff/2)-5+random(-Math.pow(1.5,9),Math.pow(1.5,9)),xdiff);
  // } else {
  //   ellipse(wdth-xdiff,hght-(xdiff/2)-5,xdiff);
  // }
  //axes
  strokeWeight(0);
  fill(0);
  // text("3",wdth-2*xdiff,hght-(xdiff/2)+15);
  // text("9",wdth-xdiff,hght-(xdiff/2)-5);
  textAlign(LEFT);
  textStyle(NORMAL);
  text("Chronological →",xmargin+zerox,ymargin);
  translate(xmargin+(zerox/2),ymargin+zeroy);
  rotate(3*PI/2);
  textAlign(CENTER);
  text("0",0,0);
  text("← Depth (km)",-150,0);
  text(maxd,-(maxd*ydiff),0);
  rotate(-3*PI/2);
  translate(-(xmargin+(zerox/2)),-(ymargin+zeroy));

  textAlign(CENTER);
  // text("Magnitude",wdth-((xmargin+zerox)/2),hght-ymargin-zeroy);
}

function drawDataPoints(){
    strokeWeight(5);
    stroke(255,0,0);

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
    // console.log('depth range:', [depthMin, depthMax])

    // cycle through the parallel arrays and add a dot for each event
    for(var i=0; i<depths.length; i++){
        // create a new dot
        if(magnitudes[i] >= val) {
          var circle = L.circle([latitudes[i], longitudes[i]], {
              color: 'black',      // the dot stroke color
              // fillColor: '#D3D3D3', // the dot fill color
              fillOpacity: 0.25,  // use some transparency so we can see overlaps
              radius: 10
          });

          // place it on the map
          circle.addTo(mymap) //.on("click",showClickedCircleOnTimeline(i));

          // save a reference to the circle for later
          circles.push(circle)
        }
    }
}

function drawHighlightedCircle(i) {
  for (r=0;r<rowcount;r++) {
    if (sortedtime[i] === table.get(r,"time")) {
      var circle = L.circle([latitudes[i], longitudes[i]], {
          color: 'red',      // the dot stroke color
          fillColor: 'red', // the dot fill color
          fillOpacity: 1,  // use some transparency so we can see overlaps
          radius: 10
      });

      // place it on the map
      circle.addTo(mymap);

      // save a reference to the circle for later
      circles.push(circle)

    }
  }
};

// function showClickedCircleOnTimeline(j) {
//   for (r=0;r<rowcount;r++) {
//     if (sortedtime[j] === table.get(r,"time")) {
//       fill(255,255,255,150);
//       //console.log(Date(table.get(r,"time")));
//       var maxy = hght - ymargin - (zeroy/2);
//       var miny = ymargin + (zeroy/2);
//       var ydiff = (maxy-miny)/(maxd-mind);
//       var magscale = 3;
//       var rdate = new Date(sortedtime[j]);
//       var maxdate = new Date(table.get(0,"time"));
//       var mindate = new Date(sortedtime[0]);
//       var totdatediff = (maxdate - mindate);
//       var xdifftime = (wdth-(2*xmargin)-(2*zerox))/(totdatediff);
//       var rdatediff = (rdate - mindate);
//       // console.log(rdatediff);
//       var x = xmargin+zerox+(xdifftime*(rdatediff));
//       var y = ymargin+zeroy+(table.getNum(r,"depth")*ydiff);
//       var diam = (table.getNum(r,"mag")-2)*magscale;
//       var rad = diam/2;
//       var rand = Math.pow(1.5,table.getNum(r,"mag"));
//       ellipse(x+random(-rand,rand),y+random(-rand,rand),diam);
//     }
//   }
// }

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

// function draw() {
//   console.log(magslider.value());
// }
