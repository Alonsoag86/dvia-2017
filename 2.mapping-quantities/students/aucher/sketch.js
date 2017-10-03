// sources: https://github.com/fraxen/tectonicplates
var table, mapImg;

var points = [];

// Trial Dot Lat/Lon
var lat = 31.0461,
  lon = 34.8516,
  trialCircle;

var canvasH = 512,
  canvasW = 1024;

var cx, cy;

var maxMag, minMag, maxDepth, minDepth, today, maxDateDiff, minDateDiff;

// PRELOAD
function preload() {
  // load data from either a local copy of one of the USGS CSVs or directly:
  table = loadTable("assets/significant_month.csv", "csv", "header");
  mapImg = loadImage('assets/techtonicMap.png');
  // table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");
}

// SETUP
function setup() {

  println(table.rows);

  createCanvas(window.innerWidth, window.innerHeight);

  var trialCoords = getCoords(lat, lon);
  // trialCircle = new circleBurst(trialCoords.x, trialCoords.y, 7, 'magenta');
  // trialCircle.display();

  // FIND MAG and DEPTH EXTREMA
  var mags = [];
  var depths = [];
  var dateDiffs = [];
  for (var r in table.rows){
      var thisPoint = table.rows[r].obj;
      thisPoint.dateDiff = dateDiff(new Date(thisPoint.time));
      // println (thisPoint.mag + ' | ' + thisPoint.depth);
      mags.push(float(thisPoint.mag));
      depths.push(float(thisPoint.depth));
      dateDiffs.push(thisPoint.dateDiff);
  }

    maxMag = max(mags);
    minMag = min(mags);
    maxDepth = max(depths);
    minDepth = min(depths);
    maxDateDiff = max(dateDiffs);
    minDateDiff = min(dateDiffs);

    // println(maxMag + ' | ' + minMag  + ' | ' + maxDepth + ' | ' + minDepth);

  // CREATE NEW BURSTS FOR DATA
  for (var r in table.rows){
    var thisPoint = table.rows[r].obj;
    thisPoint.coords = getCoords(thisPoint.latitude, thisPoint.longitude);
    thisPoint.burst = new circleBurst(thisPoint.coords.x, thisPoint.coords.y, thisPoint.mag, thisPoint.depth, thisPoint.dateDiff, thisPoint.place);
    thisPoint.burst.display();
  }

  frameRate(5);
}

// DRAW
function draw() {
  background(255);
  translate( width/2, height/2);

  imageMode(CENTER);
  image(mapImg, 0, 0);

  for (var r in table.rows){
    println(table.rows[r].obj.burst);
    table.rows[r].obj.burst.display();
  }
}

function getCoords(lat, lon){
  // center coordinates

  var clat = 0,
    clon = 0,
    // cx, cy;

  coords = new Object;
  cx = mercX(clon),
  cy = mercY(clat);

  // calculate
  coords.x = mercX(lon) - cx,
  coords.y = mercY(lat) - cy;
  return coords;
}


function circleBurst(xPos, yPos, mag, depth, dateDiff, place){
  // need an array of circles
  var startDiam = map(mag, minMag, maxMag, 5, 10);
  var colorScale = map(dateDiff, maxDateDiff, minDateDiff, 0, 1);

  var numCircles = 5;
  var stepDiameter = startDiam;
  var diameters = [];

  var startColor = color(126, 207, 253);
  var endColor = color(64, 104, 126);

  this.x = xPos;
  this.y = yPos;
  this.startDiam = startDiam;
  this.maxDiam = startDiam + (stepDiameter * (numCircles))
  this.color = lerpColor(startColor, endColor, colorScale);
  this.place = place;
  this.dateDiff = dateDiff;
  this.hover = false;

  println('dateDiff: ' + this.dateDiff);

  // fill in diameters array
  for (var i = 1; i <= numCircles; i++){ diameters.push(startDiam + (stepDiameter * (i - 1)));}
  this.diameters = diameters;

  this.checkHover = function (){
    this.hover = false;
    var x = mouseX - width/2; // account for the transform
    var y = mouseY - height/2;
    var d = dist(x, y, this.x, this.y)
    if (d <= 10 ){
      this.hover = true;
    }
  }

  // DISPLAY FUNCTION
  this.display = function(){
    // inner most circle
    fill(this.color);
    ellipse(this.x, this.y, startDiam, startDiam);

    // concentric circles
    for (var c in diameters){
      this.diameters[c] = (this.diameters[c] >= this.maxDiam) ? this.startDiam : this.diameters[c] + 1
      var opacity = map(this.diameters[c], this.startDiam, this.maxDiam, 255, 0);
      noFill();
      stroke(this.color, opacity);
      ellipse(this.x, this.y, this.diameters[c], this.diameters[c]);
    }

    // if mouse is over burst, call the tooltip
    this.checkHover();
    if (this.hover) {
      println('HOVER: ' + this.hover);
      tooltip(this);
    }
  };
};

// adapted from:  https://en.wikipedia.org/wiki/Web_Mercator
// with help from: https://www.youtube.com/watch?v=ZiYdOwOrGyc
function mercX(lon){
  lon = radians(lon);
  var a = (canvasH / PI);
  // var a = (128 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat){
  lat = radians(lat);
  var a = (canvasH / PI);
  // var a = (128 / PI) * pow(2, zoom);
  var b = tan(PI/4 + lat/2);
  var c = PI - log(b);
  return a * c;
}

function dateDiff(d){
  today = new Date(Date.now());
  // println('today: ' + today + ' | ' + d);

  var timeDiff = Math.abs(d.getTime() - today.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return diffDays;
}

function tooltip(d){
  fill('black');
  text(d.place, d.x, d.y);
  text(d.dateDiff, d.x, d.y + 10);
}
