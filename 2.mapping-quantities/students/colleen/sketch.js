//define a global variable to hold our USGS data
var table;
var bugs = []; // array of Jitter objects
var cnv;
var xoffset= 400;
var yoffset= 200;
var j = 25;


function preload() {
  // load data from either a local copy of one of the USGS CSVs or directly:
  //table = loadTable("assets/significant_month.csv", "csv", "header");
  // or (while you're designing) from the feed itself:
  table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");

}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);

}

function setup() {
  createCanvas(1200, 600);
    // Create objects

  for (var i=0; i < table.rows.length; i++) {
    bugs.push(new Jitter());
  }


  // default text color
  textColor = color(0, 0, 0);
 

}

function draw() {
	translate(xoffset, yoffset);
	//console.log(" x y offset " + xoffset, yoffset);

  background(255, 255, 255);
  for (var i=0; i<bugs.length; i++) {
    bugs[i].move();
    bugs[i].display();
    bugs[i].recent();
  	
   }
  
}

// Jitter class
function Jitter() {
	depths = int(table.getColumn("depth"));
  magnitudes = int(table.getColumn("mag"));
  longitudes = table.getColumn("longitude");
  latitudes = table.getColumn("latitude");
  places = table.getColumn("place");

  

  for (var i=0; i<bugs.length; i++) {
	  this.x = (longitudes[i] * Math.PI / 180) * 100;

	  //console.log(this.x + " this x");
	  this.y = -(latitudes[i] * Math.PI / 180) * 100;
	  //console.log(this.y + " this y");

	  this.diameter =  magnitudes[i];
	  //console.log("depths" + this.diameter);

	  this.speed = depths[i] * .10;
	  this.place = places[i];

	  
	}

  this.move = function() {
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);
   
  }

  this.display = function() {
    ellipse(this.x, this.y, this.diameter, this.diameter);
    }
    
    this.recent = function() {
    	textAlign(LEFT, TOP);
    	textSize(18);
    	if ( this.diameter >= 5) {
    		fill("red");
    	} else {
    		fill("grey");
    	}
  
      text(str(this.place), 400, i * 20 - 200);

    }
   };








