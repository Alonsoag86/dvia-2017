/* Adapted from https://processing.org/examples/clock.html */

var w = window.innerWidth,
    h = window.innerHeight;

var cx, cy; // center position of canvas

// Radius for hands of the clock
var hourCircleRadius;
var clockDiameter;
var hourDiameter;

function setup() {
  createCanvas(w, h);
  stroke(255);

  var radius = min(width, height) / 2; // this is the maximum possible radius
  clockDiameter = radius * 1.7; // make slightly smaller than maximum allowed
  hourCircleRadius = clockDiameter / 2;
  hourDiameter = (clockDiameter * TWO_PI) / (24 * 2); // largest diameter for 24

  cx = width / 2; // centers the clock
  cy = height / 2;
}

function draw() {
  background(0);

  // Draw the clock background
  fill(0);
  noStroke();
  ellipse(cx, cy, clockDiameter, clockDiameter);

  // Angles for sin() and cos() start at 3 o'clock;
  // subtract HALF_PI to make them start at the top
  var s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
  var m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
  var h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

  // Draw the hands of the clock
  stroke(255);
  strokeWeight(1);
  // line(cx, cy, cx + cos(s) * hourCircleRadius, cy + sin(s) * hourCircleRadius);

  // Draw the minute ticks
  strokeWeight(3);
  stroke(80);
  beginShape(POINTS);
  for (var a = 0; a < 360; a+=15) {
    var angle = radians(a);
    var x = cx + cos(angle) * hourCircleRadius;
    var y = cy + sin(angle) * hourCircleRadius;
    ellipse(x, y, hourDiameter, hourDiameter);
  }
  endShape();
}
