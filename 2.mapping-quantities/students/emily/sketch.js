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
var bdg;  

var pos;
var vel, grav;
var r=0;
var theta = 0;
var radius;

function preload() {
  // load data from either a local copy of one of the USGS CSVs or directly:
  EQtable = loadTable("assets/significant_month.csv", "csv","header");
  // or (while you're designing) from the feed itself:
  // table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");
};

function setup() {

createCanvas(windowWidth, windowHeight);
  var w = windowWidth;
  var h = windowHeight;

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
  district = new district(0, 50, w/3, h/2, 0.1);

  // Create city
  city = new city(0+w/3, 50, w/3, h/2, 0.1);

  // Create newTown
  newTown = new newTown(0+2*(w/3), 50, w/3, h/2, 0.1);

  pos = new p5.Vector(0,0);
  vel = new p5.Vector();
  grav = new p5.Vector();
  radius = width/400;



};

function draw() {

  cursor("assets/eyedropper.png");
	//set palette colors
	background(palette.basemap);

	//title
	textSize(10);
	fill(palette.brown);
	noStroke();
	textLeading(50);
	text("M A P P I N G   M A G N I T U D E   T O   S T R E N G T H", windowWidth/2.5, 30);

	//display district widget
	district.display();

	//display district widget
	city.display();

	//display district widget
	newTown.display();

	//display histogram
	histogram.display();
  	textSize(10);
  	noStroke();
  	fill(palette.tan);
  	textLeading(50);
  	text("A P P L I C A T I O N S  F R O M  T H E  L A S T  3 0  D A Y S", windowWidth/2.5, windowHeight-50);

	//display district structures
	push();
	translate(windowWidth/12,.50*windowHeight/2);
	//update and draw structures
	for (var i = 0; i < count; i++) {
    mods[i].update();
    mods[i].draw();
	}
	pop();

	//display city structures
	push();
	translate(windowWidth/1.9,.50*windowHeight/2);
	rotate(20);
	//update and draw structures
	for (var i = 0; i < count; i++) {
    mods[i].update();
    mods[i].draw();
	}
	pop();

	//display newTown structures
	push();
	translate(windowWidth-(windowWidth/4.2),.40*windowHeight/2);
	//update and draw structures
	for (var i = 0; i < count; i++) {
    mods[i].update();
    mods[i].draw();
	}
	pop();

};

var district = function(x, y, w, h, c) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.c = c;

  //Create structures
   // iterate through the data
  var magnitude = EQtable.getColumn("mag");
  var place = EQtable.getColumn("place"); 
  var strength = EQtable.getColumn("strength");  

 for(var i = 0; i < strength.length; i++) { 
	  var wideCount = (w/3) / unit;
	  var highCount = (h/2) / unit;
	  count = wideCount * highCount;
	  var index = 0;
	  for (var y = 0; y < highCount; y++) {
	    for (var x = 0; x < wideCount; x++) {
	      mods[index++] = new Module(x*unit, y*unit, unit/3, unit/3, 
	        random(0.1,1), unit);
	    }
	  }
	}
};

district.prototype.display = function() {

  fill(palette.ubasemap);
  rect(this.x, this.y, this.w, this.h);
  strokeWeight(2);
  stroke(palette.brown);
  textSize(10);
  fill(palette.tan);
  noStroke();
  text("D  I  S  T  R  I  C  T",this.x+20, this.y+20);
  
  stroke(palette.brown);
  strokeWeight(2);
  d = this.x+(.31*this.w);
  for(var i = 0; i < 3; i++) {
  line(d, this.y+(.3*this.h), d, this.h);
  d+=.05*this.w;
  };

  d = this.x+(.55*this.w);
  for(var i = 0; i < 3; i++) {
  line(d, this.y+(.3*this.h), d, this.h);
  d+=.05*this.w;
  };

  d = this.y+(.22*this.h);
  for(var i = 0; i < 6; i++) {
  line(this.x+(.26*this.w), this.y+d, this.x+(.7*this.w), this.y+d);
  d+=.085*this.h;
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
  textSize(10);
  fill(palette.tan);
  text("C  I  T  Y",this.x+20, this.y+20);

  stroke(palette.brown);
  strokeWeight(2);
  line(this.x+(.21*this.w),this.y+(.09*this.h), this.x+(.63*this.w), this.y+(.98*this.h));
  line(this.x+(.70*this.w),this.y+50, this.x+(.40*this.w), this.h+50);
  line(this.x+(.28*this.w),this.y+(.55*this.h), this.x+(.70*this.w), this.y+(.85*this.h));
  line(this.x+(.05*this.w),this.y+(.62*this.h), this.x+(.83*this.w), this.y+(.78*this.h));
  line(this.x+(.30*this.w),this.y+(.83*this.h), this.x+(.83*this.w), this.y+(.52*this.h));

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

  fill(palette.tan);
  text("N  E  W     T  O  W  N",this.x+20, this.y+20);

  noFill();
  stroke(palette.brown);
  strokeWeight(1);
  ellipse(this.x+(this.w/2), this.y+(this.h/2), this.w/1.5, this.w/1.5);
  ellipse(this.x+(this.w/2), this.y+(this.h/2), this.w/2.2, this.w/2.2);
  ellipse(this.x+(this.w/2), this.y+(this.h/2), this.w/4, this.w/4);
  
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
	// iterate through the data
  var magnitude = EQtable.getColumn("mag");
  var place = EQtable.getColumn("place"); 
  var strength = EQtable.getColumn("strength"); 
  strengthMin = 0.0;
  strengthMax = getColumnMax("strength"); 

	for(var i = 0; i < strength.length; i++) { 
  this.x = this.x + (map(random(strength),0,200,0,0.1) * this.xDir);
  
  // noStroke();
  // fill(palette.brown);
  // text(strength[i],0,0);

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
};

// get the maximum value within a column
function getColumnMax(columnName){
  var col = EQtable.getColumn(columnName);
  // m is the maximum value
  // purposefully start this very low
  var m = 0.0;
  for(var i =0; i< col.length; i++){
    // each value within the column
    // that is higher than m replaces the previous value
    if(float(col[i])>m){
      m = float(col[i]);
    }
  }
  // after going through all rows, return the max value
  return m;
}

// Custom method for drawing the object
Module.prototype.draw = function() {
  fill(palette.tan);
  stroke(palette.brown)
  strokeWeight(1);
  rect(this.xOff + this.x, this.yOff + this.y, 9, 7)
};

function histogram(x, y, w, h) {
 	x = 0;
    y = (height*(i/magnitude.length));
    w = width/max(magnitude)*magnitude[i];
    h = (height/magnitude.length)-5;
};

histogram.display = function() {
  var x,y,w,h;

  // iterate through the data
  var magnitude = EQtable.getColumn("mag");
  var place = EQtable.getColumn("place");  


 for(var i = 0; i < magnitude.length; i++) {  
    x = 0;
    y = (height/4*(i/magnitude.length));
    w = width/2/max(magnitude)*magnitude[i];
    h = ((height/4)/magnitude.length)-5;
   
    push();                    // <- push a drawing context
    translate(x+windowWidth/4.5, y+windowHeight/1.6);            // <- move to position
    noStroke();
  	fill(30-magnitude[i], 400/magnitude[i], 400/magnitude[i]);
    rect(0,0,w,h);             // <- draw a rectangle
    fill(255);                 // <- change colors
    textSize(10);
    text(magnitude[i],-30,h/2);      // <- draw the label 
    text(place[i], w+10, h/2);
    pop();                     // <- reset the drawing context
	}
  };


