// define a global variable to hold our USGS data
var table

function preload() {
  // load data from either a local copy of one of the USGS CSVs or directly:
  //table = loadTable("assets/all_hour.csv", "csv", "header");
  // or (while you're designing) from the feed itself:
  table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv", "csv", "header");
}

var times;

var timeMin;

var timeMax;

var length;

var tsDay = 1000 * 60 * 60 * 24;

var test; 

var mag;

var y = 100;

var osc, fft;

var playing = true;

function setup() {
createCanvas(window.innerWidth,window.innerHeight);
stroke(255)
  background(0);

osc = new p5.TriOsc(); // set frequency and type

  osc.setType('sine');
  osc.freq(240);
  osc.amp(0.1);
  osc.start();

  fft = new p5.FFT();







times = table.getColumn("time");

timeMin = times[0];

timeMax = float(times[times.length-1]);

length = timeMax - timeMin;

month = times[0].substring(5, 7); 

magArray = table.getColumn("mag");

mag = 0;

places = table.getColumn("place");




}

function draw() {
// change oscillator frequency based on mouseX
 
stroke(0,0,0,0)
textSize(32);


text("US Earthquakes Past 24 Hours", window.innerWidth/2, 50);

//text (timeMax, 100,100);

//text (times[0], 100, 200)

//text(hours, 400,200)

// text(magArray, 360, 360)



// ellipse(360, 270, magArray[0]*10, magArray[0]*10);


// background(0);   // Set the background to black
//   y = y - 1; 
//   if (y < 0) { 
//     y = 720; 
//   } 
//   line(0, y, width, y);  

  fill(255, 255, 255, 5);

// ellipse(360, 270, magArray[0]*10, magArray[0]*10);

// for (var h = - 1; i >= 0; i--) {
// 	Things[i]
// }

// var i = 0;

// if (i < magArray.length) {
// 	i++;
	
// }
// 	else if (i = magArray.length) {i=0};


// var x = Math.floor((Math.random() * width) + 1);

// var y = Math.floor((Math.random() * height) + 1);

var x = width/2;

var y = height/2;

var xMult = window.innerWidth/20

var yMult

var myVar = setInterval(myTimer, 3000);

var i = 0;


 


function myTimer() {
	stroke(0)
	ellipse(x, y, magArray[i]*50, magArray[i]*50);
	


var freq = magArray[i]*200;
  osc.freq(freq);
	stroke(0,0,0,0);
fill(255)
textSize(12);
text("Magnitude:", 50, 50 + i*35)
text (magArray[i],200, 50 + i*35)
text ("Location:", 50, 65 + i*35)
text (places[i],200, 65 + i*35)

i++;
}


// function circles() {
// for (var i = 0; i < magArray.length; i++) 
// ellipse(x, y, magArray[i]*xMult, magArray[i]*xMult);
// if (i = magArray.length) {i=0};
// text(i, 200, 200);
// }


// circles();

}