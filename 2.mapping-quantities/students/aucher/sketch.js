// sources: https://github.com/fraxen/tectonicplates
var table,
  mapImg;

var points = [];

// Trial Dot Lat/Lon
var lat = 31.0461,
  lon = 34.8516,
  trialCircle;

var canvasH = 512,
  canvasW = 1024;



function preload() {
  // load data from either a local copy of one of the USGS CSVs or directly:
  table = loadTable("assets/significant_month.csv", "csv", "header");
  mapImg = loadImage('assets/techtonicMap.png');
  // table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");
}

function setup() {
  println(table.rows.length);

  createCanvas(window.innerWidth, window.innerHeight);

  var trialCoords = getCoords(lat, lon);
  trialCircle = new circleBurst(trialCoords.x, trialCoords.y, 7, 'magenta');
  // trialCircle.display();

  for (var r in table.rows){
    var thisPoint = table.rows[r].obj;
    thisPoint.coords = getCoords(thisPoint.latitude, thisPoint.longitude);
    thisPoint.burst = new circleBurst(coords.x, coords.y, 7, 'black');
    // thisPoint.burst.display();
  }
  frameRate(5);
}

function draw() {
  background(255);
  translate( width/2, height/2);

  imageMode(CENTER);
  image(mapImg, 0, 0);

  trialCircle.display();

  for (var r in table.rows){
    println(table.rows[r].obj.burst);
    table.rows[r].obj.burst.display();
  }
}

function getCoords(lat, lon){
  // center coordinates

  var clat = 0,
    clon = 0,
    cx, cy;

  coords = new Object;
  cx = mercX(clon),
  cy = mercY(clat);

  // calculate
  coords.x = mercX(lon) - cx,
  coords.y = mercY(lat) - cy;
  println(coords.x + ' | ' + coords.y)

  return coords;
}


function circleBurst(xPos, yPos, startDiam, c){
  // need an array of circles
  var numCircles = 5;
  var stepDiameter = 10;
  var diameters = [];

  this.x = xPos;
  this.y = yPos;
  this.startDiam = startDiam;
  this.maxDiam = startDiam + (stepDiameter * (numCircles))
  this.color = color(c);
  println('this color: ' + c);
  // fill in diameters array
  for (var i = 1; i <= numCircles; i++){ diameters.push(startDiam + (stepDiameter * (i - 1)));}
  this.diameters = diameters;

  // pulsating display function
  this.display = function(){
    println('made it to display');
    // background(255);

    for (var c in diameters){
      this.diameters[c] = (this.diameters[c] >= this.maxDiam) ? this.startDiam : this.diameters[c] + 1
      var opacity = map(this.diameters[c], this.startDiam, this.maxDiam, 255, 0);

      // inner most circle
      fill(this.color);
      ellipse(this.x, this.y, startDiam, startDiam);

      // concentric circles
      noFill();
      stroke(this.color, opacity);
      println('display color: ' + this.color);
      ellipse(this.x, this.y, this.diameters[c], this.diameters[c]);
    }
  };
};

// taken from:  https://en.wikipedia.org/wiki/Web_Mercator
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
