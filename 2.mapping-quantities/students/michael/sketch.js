// define a global variable to hold our USGS data
var table
var tType = "Monthly"
var tHour;
var tDay;
var tWeek;
var tMonth;

function preload() {
  // load data from either a local copy of one of the USGS CSVs or directly:
  tHour = loadTable("assets/significant_hour.csv", "csv", "header");
  tDay = loadTable("assets/significant_day.csv", "csv", "header");
  tWeek = loadTable("assets/significant_week.csv", "csv", "header");
  tMonth = loadTable("assets/significant_month.csv", "csv", "header");  
  table = tMonth;
  // or (while you're designing) from the feed itself:
  // table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");

}

/* TODO
DONE: fix multibar
SVG BROKEN: add map

bars
TODO: Bounding Bar?
DONE: fix negative numbers
DONE: fix 0s
DONE: country 2 first chars of ID
DONE: stations sensed by number (net)(nst)
NODATA: population
NODATA: density
DONE: interpretation for magtype (implies distance)
NODATA: station real name: https://earthquake.usgs.gov/monitoring/operations/network.php
Researched and can't understand: rms = fit of data

smaller than x pixels == unselectable
write values after boxes
somesortamem loss
fade specific/generic text
combine mag/type
source selector
DONE: time selector
noinfo msg
* 
add legend
add text area
add timescale
*/

gWidth = 1000;
height = 0;
transparent = 0;

barWidth = gWidth;
barHeight = 30;
barSpacer = 40;
barBuf = 10;
barX = 100;
barY = 50;
textHeight = barHeight / 2;
bColors = [];
bCurve = 5;
grey = 200

bMax = [];  // maximums for each bar

isEvent = false;
eventX = eventY = 0;
pcentView = 100;

// our data
//labels = [];
values = [];

/*

// takes dict of key/val pairs and bars em
dict.push({
    key:   "keyName",
    value: "the value"
});
var dict = {};
dict.key1 = "value1";
dict.key2 = "value2";
*/

// sum vals of array for .reduce()
function sum(total, num) {
    //if (num.length == undefined) {  // No tag
      return total + num;
    /* } else { // Has tag
      if (total.length == undefined)
        return abs(total) + abs(num[1]);
      else
        return abs(total[1]) + abs(num[1]);
    }*/
}

// stackexchange collide alg
function mouseCollide (pointX, pointY, x, y, xW, yW) {
  if (pointX >= x &&       // right of the left edge AND
    pointX <= x + xW &&    // left of the right edge AND
    pointY >= y &&         // below the top AND
    pointY <= y + yW) {    // above the bottom
      return true;
  }
  return false;
};

c = 0; // Unbelievable. (color object)

// Alpha change on existing color. Really hacky.
function setAlpha(myC, a) {
  r = red(myC);
  g = green(myC);
  b = blue(myC);
  
  return c(r,g,b,a);
}


// P5JS BUG: translate/rotate does not work for mouseX/Y!
// gotta provide manual bounding boxes!
function drawMenu(vals, bboxes, bX, bY, r, c) {
    
  push();
  angleMode(DEGREES);
  translate(bX, bY);
  rotate(r);
  
    var curY = 0;
    var curX = 0;
    
    for (var xidx = 0; xidx < vals.length; xidx++, curX+=curWidth) {

      var c = bColors[xidx%bColors.length];
      stroke(c);
      fill(c);
      
      var lCurve = 0;
      var rCurve = 0;
     
      if (xidx == 0)
        lCurve = bCurve;
        
      if (xidx == vals.length - 1)
        rCurve = bCurve;
          
      var curWidth = 100;
      
      if (mouseCollide (mouseX, mouseY, bboxes[xidx][0], bboxes[xidx][1], bboxes[xidx][2], bboxes[xidx][3])) {
        // println(xidx);
        tabArr = [tHour, tDay, tWeek, tMonth];
        if (table != tabArr[xidx]) {
          table = tabArr[xidx];
          pcentView = 0;
        };
      }       
      
      rect(curX, curY, curWidth, barHeight, lCurve, rCurve, rCurve, lCurve);
        
      textAlign(CENTER);
      stroke(grey, 120);
      fill(grey, 120);      
      text(vals[xidx], curX + curWidth/2, curY + ((barHeight + barBuf)/2));
    }
  pop(); 
   
  for (var xidx = 0; true && xidx < vals.length; xidx++) { // debug
    stroke(111);
    noFill();
    rect(bboxes[xidx][0], bboxes[xidx][1], bboxes[xidx][2], bboxes[xidx][3]);
  }

}

// Draw info in a variety of ways adapted to bar format
// vals     : Actual data
// dispVals : Data in display format
// altVals  : Alternative values if data missing, etc
function drawBars(title, vals, dispVals, altVals) {
  
  if (table.rows.length == 0) {
    a = pcentView<100?pcentView:120;      
    stroke(grey, a);
    fill(grey, a);
    text("No Data For This Period.", barX, barY + 50);
    return;
  }
  
  for (var yidx=0; yidx < vals.length; yidx++) {
    
    var curY = barY + (barHeight + barSpacer)*yidx;
    var curX = barX;
    
    var bUnit = (1.0 * barWidth) / vals[yidx].reduce(sum);  // get base fraction of pixels   
      
    push();  // Bounding Bar
    stroke(grey);
    strokeWeight(3.0);
    noFill();
    //rect(curX - 5, curY - 5, barWidth + barBuf, barHeight + barBuf, bCurve, bCurve, bCurve, bCurve);
    pop()
    
    push()
    for (var xidx = 0; xidx < vals[yidx].length; xidx++, curX+=curWidth) {
      var curTag = 0;
      
      var c = bColors[xidx%bColors.length];
      stroke(c);
      fill(c);
      
      var lCurve = 0;
      var rCurve = 0;
     
      if (xidx == 0)
        lCurve = bCurve;
        
      if (xidx == vals[yidx].length - 1)
        rCurve = bCurve;
      
      if (pcentView < 100 && eventX == xidx && eventY != yidx) {
        lCurve = map(pcentView, 100, 0, 0, bCurve);
        rCurve = map(pcentView, 100, 0, 0, bCurve);
      }
      
      if (pcentView < 100 && eventX != xidx && eventY != yidx) {
        var a = map(pcentView, 0, 100, 0, 255);
        stroke(setAlpha(c, a));  // stupid way to change alpha
        fill(setAlpha(c, a));  
      }      
     
      /*
      if (isEvent && eventX == xidx) { // && eventY == yidx) {
        lCurve = bCurve;
        rCurve = bCurve;
      }*/
      
      // if (vals[yidx][xidx].length == undefined) {  // No tag
        var curVal = vals[yidx][xidx];
      //} else { // Has tag
      //  var curTag = vals[yidx][0][xidx];
      //  var curVal = vals[yidx][1][xidx];
      if (dispVals[yidx].length) {
        var curTag = dispVals[yidx][xidx];
      }
      //}
          
      var curWidth = curVal*bUnit;
      
      if (mouseCollide (mouseX, mouseY, curX, curY, curWidth, barHeight)) {
        isEvent = true;
        eventX = xidx;
        eventY = yidx;
      }       
      
      rect(curX, curY, curWidth, barHeight, lCurve, rCurve, rCurve, lCurve);
        
      textAlign(CENTER);
      var a = xidx==eventX||yidx==eventY?120:pcentView;
      stroke(grey, a);
      fill(grey, a);      
      if (curTag) { // if a tag exists, print it
        text(curTag, curX + curWidth/2, curY + ((barHeight + barBuf)/2));
      } else {
        a = pcentView<100 && eventX==xidx?120-pcentView:0;      
        stroke(grey, a);
        fill(grey, a);
        if (altVals[yidx].length)
          text(altVals[yidx][xidx], curX + curWidth/2, curY + ((barHeight + barBuf)/2));
        else
          text(vals[yidx][xidx], curX + curWidth/2, curY + ((barHeight + barBuf)/2));
      }
         
      pop();
    }
    
    //textFont("Helvetica", textHeight); // BUG: Why is AA so smudgy?
    textSize(textHeight);
    textAlign(LEFT);
    stroke(grey);
    fill(grey);
    if (title.length)
      text(title[yidx] + ": " + bMax[yidx], barX, curY - 10);
      
  }
  pop();
}

magTypeXlate = {
 "md":"Clipped Shaking Duration",
 "ml":"Richter",
 "mb_lg":"Lg Surface Waves",
 "mlg":"Lg Surface Waves",
 "mb":"Short P Body Waves",
 "ms":"Rayleigh Surface Wave",
 "ms_20":"Rayleigh Surface Wave",
 "mw":"Generic Unknown",
 "mwb":"Long-Perioud, P & SH Waves",
 "mwc":"Mid/Long Period & Surface Waves",
 "mwr":"Regional Complete Waveforms",
 "mww":"W-phase Inversion",
 "mi":"Broadband/P Wave",
 "mwp":"Broadband/P Wave",
 "me":"Integrated Digital Waveforms"
}

var info;
// in generic show:
// weekly, monthly, etc
// tot events
// latest event?
function textArea() {
  info = createGraphics(500, 300);  // P5JS BUG: THIS LEAKS!
  
  push()
  info.textSize(20);
  info.textAlign(LEFT);
  info.stroke(grey);
  info.fill(grey);
  
  if (isEvent) {
    var nst = table.getColumn("nst")[eventX];
    nst = nst==""?"NA":nst

    d = new Date(table.getColumn("time")[eventX]); // parse date
  }
  
  if (isEvent)
    info.text(	"\nData Source: " + "Monthly" +
       "\nLocal Event Time: " + d.toLocaleString() +
        "\nEvent Name: " + table.getColumn("id")[eventX] +
        "\nLocation: " + table.getColumn("place")[eventX] + 
    		"\nType Icon: " + table.getColumn("type")[eventX] +
    		"\nMagnitude Data Type: " + magTypeXlate[table.getColumn("magType")[eventX]] +
    		"\nNumber of Stations Reporting: " + nst +
    		"\nStatus: " + table.getColumn("status")[eventX], 0, 0);
}


function setup() {
  bColors = [color("#005548"), color("#7D3051"), color("#2F1F26"), color("#262E35"), color("#783D28"), color("#49000D"), color("#6F6473"), color("#86414F"), color("#357157"), color("#00617E"), color("#7A6333"), color("#77242A"), color("#3E3E24"), color("#7E7E36"), color("#445B1C"), color("#3F342F"), color("#783D28"), color("#7A6333")];

  c = color; // Really?!?
  
  gWidth = windowWidth; // set global width
  createCanvas(windowWidth, windowHeight);
  frameRate(25);
  img = loadImage('a.svg');
}

// deal intelligently with missing or nonstandard data
function scrub(val) {
  if (typeof(val) == "string") {
    val = val==""?"NA":val;
    val = val=="0"?"NA":val;
  }
  if (typeof(val) == "number") {
    val = val==0?0.05:val;
    val = val!=abs(val)?abs(val):val;
  } 
  return(val);
}

// set val to default 
function one(val) {
  return(1);
}

// make zeros high enough not to effect calculation
function zeroToOneK(val) {
  return(val<1?1000:val);
}

// set val to cap country code
function ccc(val) {
  return(val.substring(0, 2).toUpperCase());
}

halfLow = 0;
// set the min to half of the lowest val.
// Strategy to deal sanely with non-existing data
function minHalfLow(val) {
  return(val<1?halfLow:val);
}

function degToKm(val) {
  if (val == "NA")
    return(val);
  return(Math.round(val*111.2)); // from website
}

function round(val) {
  return(Math.round(val));
}

dispVals = [];
altVals = [];

function update() {
  barWidth = gWidth - 200;
  bMax = new Array(values.length).fill(0);
  
  // if event is active, change the percent of other bars we view
  if (!isEvent && pcentView != 100) {
    pcentView+=4;
    if (pcentView > 100) pcentView = 100;
  }
  
  if (isEvent) {
    pcentView-=4;
    if (pcentView < 0) pcentView = 0;
  } 
  
  textArea()
  
  if (table.rows.length == 0) {
   isEvent = false;
   return;
  }
  
  //values = [[7.5,22,2,6,8.8,22,5,7,2,6,8], [3,2,6,8,22,5,7,22,2,6,8], [["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5]]];
  //labels = ["Magnitude", "Population", "Stations"];
  
  values = [];
  
  values.push(table.getColumn("mag").map(Number));
  dispVals.push([]);
  altVals.push([]);
  
  values.push(table.getColumn("depth").map(Number).map(scrub));
  dispVals.push([]);
  altVals.push(table.getColumn("depth").map(scrub));
  
  //values.push(table.getColumn("id").map(one));
  //dispVals.push(table.getColumn("id").map(scrub).map(ccc));
  //altVals.push([]);

  var numStations = table.getColumn("nst").map(Number).map(scrub)
  var nsFiltered = numStations.map(zeroToOneK);
  var low = nsFiltered.reduce(function(a, b, i, arr) {return Math.min(a,b)});
  halfLow = low/2;
  
  values.push(numStations.map(minHalfLow));
  dispVals.push(table.getColumn("net").map(scrub).map(ccc));
  altVals.push([]); 
  
  magLocSrc = [];
  m = table.getColumn("magSource").map(scrub).map(ccc);
  l = table.getColumn("locationSource").map(scrub).map(ccc);
  for (var idx=0; idx < m.length; idx++)
    magLocSrc[idx] = m[idx] + "/" + l[idx];
    
  values.push(table.getColumn("magSource").map(one));
  dispVals.push(magLocSrc);
  altVals.push([]);
  
  //values.push(table.getColumn("magSource").map(one));
  //dispVals.push(table.getColumn("magSource").map(scrub).map(ccc));
  //altVals.push([]);
  
  //values.push(table.getColumn("locationSource").map(one));
  //dispVals.push(table.getColumn("locationSource").map(scrub).map(ccc));
  //altVals.push([]);
  
  values.push(table.getColumn("dmin").map(Number).map(scrub).map(degToKm)); // can't handle 0
  dispVals.push([]);
  altVals.push(table.getColumn("dmin").map(scrub).map(degToKm));
  
  labels = [];
  labels.push("Magnitude");
  labels.push("Depth (km)");
  //labels.push("Country");
  labels.push("Event Source (Network/#Stations)");
  labels.push("Magnitude / Location Source (Network)")
  //labels.push("Magnitude Source (Network)");
  //labels.push("Location Source (Network)");
  labels.push("Farthest Station (km)");

  
  // println(eventX + " " + eventY + " " + pcentView + " " + isEvent);
    
  
  for (var yidx = 0; yidx < values.length; yidx++)
    for (var xidx = 0; xidx < values[yidx].length; xidx++) {
      if (values[yidx][xidx].length == undefined) {  // No tag
        if (bMax[yidx] < values[yidx][xidx]) bMax[yidx] = values[yidx][xidx];
      } else { // Has tag
        if (bMax[yidx] < values[yidx][1][xidx]) bMax[yidx] = values[yidx][1][xidx];
      }
    
      if (xidx != eventX && yidx != eventY) {       
        if (values[yidx][xidx].length == undefined) {  // No tag
          values[yidx][xidx] = map(pcentView, 0, 100, 0, values[yidx][xidx]);
        } else { // Has tag
          values[yidx][1][xidx] = map(pcentView, 0, 100, 0, values[yidx][1][xidx]);
        }
      }
    }
   isEvent = false;
   
}

function draw() {
  update();

  background(0);
  menu = ["Hourly", "Daily", "Weekly", "Monthly"];
  bboxes = [[35, 350, barHeight, 100], [35, 250, barHeight, 98], [35, 150, barHeight, 98], [35, 50, barHeight, 98]]
  drawMenu(menu, bboxes, 35, 450, -90, bColors);
  
  drawBars(labels, values, dispVals, altVals);
  
  stroke(111);
  fill(111);
  
  image(img, 0, 0);
  
  image(info, 50, 600);
  //xml = loadXML("assets/mammals.xml");
}

function windowResized() {
  gWidth = windowWidth; // set global width
  resizeCanvas(windowWidth, windowHeight);
}
