

var cx, cy;

var millisecondsRadius;
var secondsRadius;
var minutesRadius;
var hoursRadius;

function setup() {
  createCanvas(700, 700);
  stroke(0);

  var radius = min(width, height) / 2; // this is the maximum possible radius
  millisecondsRadius = radius * 0.25;
  secondsRadius = radius * 0.50;
  minutesRadius = radius * 0.75;
  hoursRadius = radius * 1;

  cx = width / 2;
  cy = height / 2;
 
}

function draw() {
  background(0);

  //Background Circles

  fill(0,0,125);
  noStroke();
  ellipse(cx, cy, hoursRadius, hoursRadius);

  fill(27, 0, 125);
  noStroke();
  ellipse(cx, cy, minutesRadius, minutesRadius);

  fill(125, 0, 125);
  noStroke();
  ellipse(cx, cy, secondsRadius, secondsRadius);

  fill(155,0,0);
  noStroke();
  ellipse(cx, cy, millisecondsRadius, millisecondsRadius);

  
// Enlarge Circle Due to time
   var n = map (millisecond(), 0, 60, 0, MillisecondsRadius);
   var s = map(second(), 0, 60, MillisecondsRadius, SecondsRadius);
   var m = map(minute(), 0, 60, SecondsRadius, MinutesRadius);
   var h = map(hour(), 0, 24, MinutesRadius, HoursRadius);
  
  for (var i = MillisecondsRadius; i < 60; MillisecondsRadius; i++){
    ellipse(cx, cy, millisecondsRadius, millisecondsRadius);
  
  for (var i = secondsRadius; i < 60; secondsRadius; i++){
    ellipse(cx, cy, secondsRadius, secondsRadius);   
    
  for (var i = minutesRadius; i < 60; minutesRadius; i++){
    ellipse(cx, cy, minutesRadius, minutesRadius); 
 
  for (var i = hoursRadius; i < 24; hoursRadius; i++){
    ellipse(cx, cy, hoursRadius, hoursRadius);    
    
    
//Growing circles
  fill(0,0,225);
  noStroke();
  ellipse(cx, cy, hoursRadius, hoursRadius);

  fill(127, 0, 225);
  noStroke();
  ellipse(cx, cy, minutesRadius, minutesRadius);

  fill(225, 0, 225);
  noStroke();
  ellipse(cx, cy, secondsRadius, secondsRadius);

  fill(255,0,0);
  noStroke();
  ellipse(cx, cy, millisecondsRadius, millisecondsRadius);

  }
  endShape();
}
