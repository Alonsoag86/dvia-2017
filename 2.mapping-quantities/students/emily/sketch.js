// define a global variable to hold our USGS data
var EQtable;
var district;
var city;
var newTown;
var palette = {
      "basemap": "#8f8181",
      "ubasemap": "#8C7E7E",
      "sbasemap": "#766A6A",

      "mag3": "#9fc4c4",
      "mag4": "#76a3a3",
      "mag5": "#587a7a",
      "mag6": "#1d7070",
      "mag7": "#144d4d",
      "mag8": "#0d3333",

      "tan": "#c7b299",
      "brown": "#463e38",
  };

var unit = 40;
var count;
var mods = [];

function preload() {
  // load data from either a local copy of one of the USGS CSVs or directly:
  EQtable = loadTable("assets/significant_month.csv", "csv","header");
  // or (while you're designing) from the feed itself:
  // table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");
};

function setup() {

createCanvas(displayWidth, displayHeight);
  var w = displayWidth;
  var h = displayHeight;

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

  // Create district
  district = new district(0, 0, w/3, h/2, 0.1);

  // Create city
  city = new city(0+w/3, 0, w/3, h/2, 0.1);

  // Create newTown
  newTown = new newTown(0+2*(w/3), 0, w/3, h/2, 0.1);

};

function draw() {

	//set palette colors
	background(palette.basemap);

	//display district widget
	district.display();

	//display district widget
	city.display();

	//display district widget
	newTown.display();

	//update and draw structures
	for (var i = 0; i < count; i++) {
    mods[i].update();
    mods[i].draw();
	}

};

var district = function(x, y, w, h, c) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.c = c;

  //Create structures
  var wideCount = (w/1.2) / unit;
  var highCount = (h/1.45) / unit;
  count = wideCount * highCount;
  var index = 0;
  for (var y = 0; y < highCount; y++) {
    for (var x = 0; x < wideCount; x++) {
      mods[index++] = new Module(x*unit, y*unit, unit/2, unit/2, 
        random(0.05, 0.8), unit);
    }
  }
};

district.prototype.display = function() {
  noStroke();
  fill(palette.ubasemap);
  rect(this.x, this.y, this.w, this.h);
  stroke(palette.brown);
  strokeWeight(2);
  
  d = 50;
  for(var i = 0; i < 3; i++) {
  line(this.x+d, this.y+50, this.x+d, this.y+(this.y+300));
  d+=50;
  };

  d = 270;
  for(var i = 0; i < 3; i++) {
  line(this.x+d, this.y+50, this.x+d, this.y+(this.y+300));
  d+=50;
  };

  d = 80;
  for(var i = 0; i <6; i++) {
  line(this.x+20, this.y+d, this.x+400, this.y+d);
  d+=40;
  };
};

var city = function(x, y, w, h, c) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.c = c;
};

city.prototype.display = function() {
  noStroke();
  fill(palette.sbasemap);
  rect(this.x, this.y, this.w, this.h);

  stroke(palette.brown);
  strokeWeight(2)
  line(this.x+this.w/6, this.y+this.h/8, this.w+this.w/1.5, this.h-this.h/10);
  line(this.x+this.w/2, this.y+this.h/8, this.w+this.w/10, this.h-this.h/10);
};

var newTown = function(x, y, w, h, c) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.c = c;
};

newTown.prototype.display = function() {
  noStroke();
  fill(palette.ubasemap);
  rect(this.x, this.y, this.w, this.h);
};

function Module(_xOff, _yOff, _x, _y, _speed, _unit) {
  this.xOff = _xOff;
  this.yOff = _yOff;
  this.x = _x;
  this.y = _y;
  this.speed = _speed;
  this.unit = _unit;
  this.xDir = 1;
  this.yDir = 1;
};

// Custom method for updating the variables
Module.prototype.update = function() {
  this.x = this.x + (this.speed * this.xDir);
  if (this.x >= this.unit || this.x <= 0) {
    this.xDir *= -1;
    this.x = this.x + (1 * this.xDir);
    this.y = this.y + (1 * this.yDir);
  };
  if (this.y >= this.unit || this.y <= 0) {
    this.yDir *= -1;
    this.y = this.y + (1 * this.yDir);
  };
};

// Custom method for drawing the object
Module.prototype.draw = function() {
  fill(palette.tan);
  stroke(palette.brown)
  strokeWeight(1);
  rect(this.xOff + this.x, this.yOff + this.y, 9, 7)
  // ellipse(this.xOff + this.x, this.yOff + this.y, 6, 6);
};


