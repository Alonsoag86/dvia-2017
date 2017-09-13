/* Adapted from https://processing.org/examples/clock.html */



var cx, cy; // center position of canvas

// Radius for hands of the clock
var secondsRadius;
var minutesRadius;
var hoursRadius;
var clockDiameter;

function setup() {
  createCanvas(700, 700);
  stroke(0);

  var radius = min(width, height) / 2; // this is the maximum possible radius
  milisecondsRadius = radius * 0.25;
  secondsRadius = radius * 0.50;
  minutesRadius = radius * 0.75;
  hoursRadius = radius * 1;

  cx = width / 2;
  cy = height / 2;
}

function draw() {
  background(0);




  // Angles for sin() and cos() start at 3 o'clock;
  // subtract HALF_PI to make them start at the top
  var s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
  var m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
  var h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

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
  ellipse(cx, cy, milisecondsRadius, milisecondsRadius);

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
ellipse(cx, cy, milisecondsRadius, milisecondsRadius);

  // Draw the hands of the clock
  stroke(255);
  strokeWeight(1);
  line(cx, cy, cx + cos(s) * secondsRadius, cy + sin(s) * secondsRadius);
  strokeWeight(2);
  line(cx, cy, cx + cos(m) * minutesRadius, cy + sin(m) * minutesRadius);
  strokeWeight(4);
  line(cx, cy, cx + cos(h) * hoursRadius, cy + sin(h) * hoursRadius);

  // Draw the minute ticks
  strokeWeight(2);
  beginShape(POINTS);
  for (var a = 0; a < 360; a+=6) {
    var angle = radians(a);
    var x = cx + cos(angle) * secondsRadius;
    var y = cy + sin(angle) * secondsRadius;
    vertex(x, y);
  }
  endShape();
}
