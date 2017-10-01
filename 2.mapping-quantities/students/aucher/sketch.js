// define a global variable to hold our USGS data


// sources: https://github.com/fraxen/tectonicplates

//mapbox://styles/aucher/cj87xw3fi3z8a2qpbdhsqfcw8
var table,
  mapImg,
  trialCircle,
  opacity;

var canvasW = 1024,
  canvasH = 512;



function preload() {
  // var accessToken = 'pk.eyJ1IjoiYXVjaGVyIiwiYSI6ImNqODd4NnBndzFjZDQyd3FocnM4Njc2NWQifQ.dql4s6oWRANbYGt44i6n9A'
  // var mapboxUrl = 'https://api.mapbox.com/styles/v1/aucher/cj87xw3fi3z8a2qpbdhsqfcw8/static/25.613590,-0.000000,0.78,0.00,0.00/' + canvasW + 'x' + canvasH + '?access_token=' + accessToken
  // println('url: ' + mapboxUrl);
  // load data from either a local copy of one of the USGS CSVs or directly:
  // table = loadTable("assets/significant_month.csv", "csv", "header");
  mapImg = loadImage('assets/techtonicMap.png');
  // or (while you're designing) from the feed itself:
  // table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");
}

function setup() {
  // println(table)
  createCanvas(canvasW, canvasH);
  trialCircle = new circleBurst( width/2, height/2, 7);
  frameRate(5);
  // globe = createShape(SPHERE, 200);
}

function draw() {
  image(mapImg, 0, 0);
  trialCircle.display();
}

function circleBurst(xPos, yPos, startDiam, color){
  // need an array of circles
  var numCircles = 5;
  var stepDiameter = 10;
  var diameters = [];

  this.x = xPos;
  this.y = yPos;
  this.startDiam = startDiam;
  this.maxDiam = startDiam + (stepDiameter * (numCircles));

  // fill in diameters array
  for (var i = 0; i < numCircles; i++){ diameters.push(startDiam + (stepDiameter * (i - 1)));}
  this.diameters = diameters;

  // pulsating display function
  this.display = function(){
    // background(255);

    for (var c in diameters){
      this.diameters[c] = (this.diameters[c] >= this.maxDiam) ? this.startDiam : this.diameters[c] + 1
      opacity = map(this.diameters[c], this.startDiam, this.maxDiam, 255, 0);

      // inner most circle
      fill(0);
      ellipse(this.x, this.y, startDiam, startDiam);

      // concentric circles
      noFill();
      stroke(253, 41, 252	, opacity);
      ellipse(this.x, this.y, this.diameters[c], this.diameters[c]);
    }
  };
};
