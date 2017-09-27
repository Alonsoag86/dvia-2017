var xPos = (window.innerWidth/2); // starting x position to draw
var yPos = (window.innerHeight/2);  // starting y position to draw
var cirhHeight = 0; // height of each cir
var cirhMax = window.innerHeight; // maximum width of each cir <-- this changes over time
var cirmHeight = 00; // height of each cir
var cirmMax =0; // maximum width of each cir <-- this changes over time
var cirsHeight = 0; // height of each cir
var cirsMax = 0; // maximum width of each cir <-- this changes over time


function secondLine() {
   var n = 10;
  while (n < 60) {
  arc(xPos, yPos, n, n,0,0,PI);
  n= n+10;
 }
};

function minuteLine() {
   var a = 60;
  while (a < 240) {
  arc(xPos, yPos, a, a,0,0,PI);
  a= a+30;
 }
};



//this gets called only once in the very beginning
function setup() {
	createCanvas(window.innerWidth,window.innerHeight);
}

//this gets called every frame (about 60 frames per second)
function draw() {

  var h = map(hour(), 0, 24, 0, cirhMax);
  var m = map(minute(), 0, 60, 0, h); // Map the function minute() to values from 0 - cirMax
  var s = map(second(), 0, 60, 0, m);


  background(255);

  fill(0,0,0,0);
  stroke(0,0,0,30);
  function hourLine() {
   var h1 = 0;
   var h2 = h;
  while (h1 < cirhMax) {
    if (h1 < h2) {h1=h1+40}
      else{
  arc(xPos, yPos, h1, h1,0,0,PI);
  h1= h1+40;
  }
 }
 };
  hourLine();

  function minLine() {
   var m1 = 0;
   var m2 = m;
   var m3 = m/60
  while (m1 < h) {
    if (m1 < m2) {m1=m1+m3}
      else{
  arc(xPos, yPos, m1, m1,0,0,PI);
  m1= m1+m3;
  }
 }
 };
  minLine();

stroke(255,255,255,50);
  function secLine() {
   var s1 = 0;
   var s2 = s;
   var s3 = s/120;
  while (s1 < m) {
    if (s1 < s2) {s1=s1+s3}
      else{
  arc(xPos, yPos, s1, s1,0,0,PI);
  s1= s1+s3;
  }
 }
 };
 // secLine();



  stroke(0,0,0,25);
  fill(0, 0, 0);



  

   //draw 3 background cirs to indicate the max width
  
   fill(0, 00, 00, 50);
   ellipse(xPos,yPos, h, h);   // cir for hours

 

    fill(0, 0, 0, 50);

  ellipse(xPos,yPos, m, m);   // cir for minutes

  
  

     ellipse(xPos,yPos, s, s);  // cir for seconds



  stroke(0,0,0,50);
  fill(0,0,0,0);
 // arc(500, 500, 960, 960, 0, HALF_PI);
}