// define a global variable to hold our USGS data
var EQtable;
var magnitude;
var strength;

function preload() {
  // load data from either a local copy of one of the USGS CSVs or directly:
  EQtable = loadTable("assets/significant_month.csv", "csv","header");
  // or (while you're designing) from the feed itself:
  // table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");
}

function setup() {

createCanvas(displayWidth, displayHeight);
  var w = displayWidth;
  var h = displayHeight;
  background(255); 
  fill(255, 0, 0, 30);

  //test earthquake data connection
  println(EQtable.getRowCount() + " total rows in table");

  //number of earthquakes
  var size = EQtable.getRowCount();

  //select values:mag/strength columns
  var magnitude = EQtable.getColumn("mag");
   //select values:stength column
  var strength = EQtable.getColumn("strength");

  //test magnitude / strength arrays
  println(magnitude);
  println(strength);
  remove();
}

function draw() {
	fill(204, 101, 192, 127);
  	stroke(127, 63, 120);
	rect(40, 120, 120, 40);

}



