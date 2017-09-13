var xPos = 500; // starting x position to draw
var yPos = 500;  // starting y position to draw
var cirhHeight = 0; // height of each cir
var cirhMax = 960; // maximum width of each cir <-- this changes over time
var cirmHeight = 00; // height of each cir
var cirmMax = 240; // maximum width of each cir <-- this changes over time
var cirsHeight = 0; // height of each cir
var cirsMax = 60; // maximum width of each cir <-- this changes over time

//this gets called only once in the very beginning
function setup() {
	createCanvas(1000,1000);
}

//this gets called every frame (about 60 frames per second)
function draw() {
  background(255);
  fill(0, 0, 0);

  var h = map(hour(), 0, 24, 0, cirhMax); // Map the function hour() to values from 0 - cirMax
  var m = map(minute(), 0, 60, 0, cirmMax); // Map the function minute() to values from 0 - cirMax
  var s = map(second(), 0, 60, 0, cirsMax); // Map the function second() to values from 0 - cirMax

   //draw 3 background cirs to indicate the max width
  fill(5, 5,5, 00);
  stroke(0,0,0,50)
//  ellipse(xPos,yPos,cirhMax,cirhHeight);   
 // ellipse(xPos,yPos,cirmMax,cirmHeight);   
 arc(xPos, yPos, cirhMax, cirhMax,0,0,5,PI);

arc(xPos, yPos, cirmMax, cirmMax,0,0,PI);
 arc(xPos, yPos, cirsMax, cirsMax,0,0,PI);



function secondLine() {
   var n = 10;
while (n < 60) {
  arc(xPos, yPos, n, n,0,0,PI);
  n= n+10;
 }
};
secondLine()

function minuteLine() {
   var a = 60;
while (a < 240) {
  arc(xPos, yPos, a, a,0,0,PI);
  a= a+30;
 }
};


function hourLine() {
   var b = 240;
while (b < 960) {
  arc(xPos, yPos, b, b,0,0,PI);
  b= b+60;
 }
};
//hourLine()




  stroke(0,0,0,0)
   fill(255, 00, 00, 50);
  ellipse(xPos,yPos,h+240,h+240);   // cir for hours
  fill(0, 255, 0, 50);
  ellipse(xPos,yPos,(m*2)+60,(m*2)+60);   // cir for minutes
  fill(0, 0, 255, 50);
  ellipse(xPos,yPos,s,s);   // cir for seconds

 
}