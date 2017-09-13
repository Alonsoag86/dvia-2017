/* Adapted from https://processing.org/examples/clock.html */

var cx, cy; // center position of canvas

// Radius for hands of the clock
var secondsRadius;
var minutesRadius;
var hoursRadius;
var clockDiameter;



function setup() {
  createCanvas(640, 360);
  stroke(255);

  var radius = min(width, height) / 2; // this is the maximum possible radius
  secondsRadius = radius * 0.72;
  minutesRadius = radius * 0.60;
  hoursRadius = radius * 0.50;
  clockDiameter = radius * 1.8;

  cx = width / 2;
  cy = height / 2;
}

function draw() {
  // background(0);

  // Draw the clock background
  fill(255);
  noStroke();
  ellipse(cx, cy, clockDiameter, clockDiameter);

  // Angles for sin() and cos() start at 3 o'clock;
  // subtract HALF_PI to make them start at the top
  var s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
  var m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
  var h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;


  	// sets color variables to time
	var redValue =  second() * (255 / 60); // isolates red value
	var greenValue = minute() * (255 / 60); // isolates green value
	var blueValue = hour() * (255 / 24); // isolates blue value

	//sets fill color 
	var c = color(redValue, greenValue, blueValue);

  // Draw shape based on points on end of radii
  fill(c);
  strokeWeight(0);
  beginShape();
  vertex(cx + cos(s) * secondsRadius, cy + sin(s) * secondsRadius);
  vertex(cx + cos(m) * secondsRadius, cy + sin(m) * secondsRadius);
  vertex(cx + cos(h) * secondsRadius, cy + sin(h) * secondsRadius);
  endShape(CLOSE);


  // draw center point for reference
  // fill(60);
  // arc (cx, cy, 20, 20, 0 - HALF_PI, (day()(TWO_PI / 31)) - HALF_PI);
  fill(220);
  arc(cx, cy, 60, 60, (PI + HALF_PI), (day() * (TWO_PI / 31) - HALF_PI));
  fill(160);
  arc(cx, cy, 40, 40, (PI + HALF_PI), (month() * (TWO_PI / 12) - HALF_PI));
  fill(0);
  ellipse (cx, cy, 20, 20);
}