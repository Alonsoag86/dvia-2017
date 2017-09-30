// define a global variable to hold our USGS data
var table
// var ang = 0;
var trialCircle;
var opacity;

// function preload() {
//   // load data from either a local copy of one of the USGS CSVs or directly:
//   table = loadTable("assets/significant_month.csv", "csv", "header");
//   // or (while you're designing) from the feed itself:
//   // table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");
// }

function setup() {
  println(table)
  createCanvas(window.innerWidth, window.innerHeight);
  trialCircle = new circleBurst( width/2, height/2, 7);
  frameRate(5);
}

function draw() {
  println(trialCircle);
  trialCircle.display();
}

function circleBurst(xPos, yPos, startDiam){
  // need an array of circles
  var numCircles = 7;
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
    background(255);

    for (var c in diameters){
      this.diameters[c] = (this.diameters[c] >= this.maxDiam) ? this.startDiam : this.diameters[c] + 1
        opacity = map(this.diameters[c], this.startDiam, this.maxDiam, 255, 0);

      // inner most circle
      fill(0);
      ellipse(this.x, this.y, startDiam, startDiam);

      // concentric circles
      noFill();
      stroke(0, opacity);
      ellipse(this.x, this.y, this.diameters[c], this.diameters[c]);
    }
  };
};
