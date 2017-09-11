/* Adapted from https://processing.org/examples/clock.html */

var w = window.innerWidth,
    h = window.innerHeight;

var cx, cy; // center position of canvas

// Radius for hands of the clock
var hourCirclePos;
var minCirclePos;
var clockDiameter;
var hourDiameter;
var minDiameter;

function setup() {
  createCanvas(w, h);
  stroke(255);

  var radius = min(width, height) / 2; // this is the maximum possible radius
  clockDiameter = radius * 1.7; // make slightly smaller than maximum allowed
  hourCirclePos = clockDiameter / 2;
  hourDiameter = (clockDiameter * TWO_PI) / (24 * 2); // largest diameter for 24
  minDiameter = (hourDiameter * TWO_PI) / (60 * 2);

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
  // line(cx, cy, cx + cos(s) * hourCirclePos, cy + sin(s) * hourCirclePos);

  // Draw the minute ticks
    beginShape(POINTS);
  for (var a = 0; a < 360; a+= 360/24) {
    var angle = radians(a);
    var x = cx + cos(angle) * hourCirclePos;
    var y = cy + sin(angle) * hourCirclePos;
    strokeWeight(3);
    stroke(80);
    ellipse(x, y, hourDiameter, hourDiameter);
    for (var b=0; b < 360; b+= 360/60){
      minCirclePos = hourDiameter / 2;
      var subangle = radians(b);
      var subx = x + cos(subangle) * minCirclePos;
      var suby = y + sin(subangle) * minCirclePos;
      strokeWeight(.5);
      ellipse(subx, suby, minDiameter, minDiameter);
    }
  }
  endShape();
}
