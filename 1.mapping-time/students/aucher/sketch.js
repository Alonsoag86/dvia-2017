/* Adapted from https://processing.org/examples/clock.html */
// var SunCalc = require('suncalc');

var w = window.innerWidth,
    h = window.innerHeight;

var cx, cy; // center position of canvas

// Radius for hands of the clock
var hourCirclePos;
var minCirclePos;
var clockDiameter;
var hourDiameter;
var minDiameter;

// Colors
var night;
var day;
var sunrise;
var sunset;
var sunriseTime;
var sunsetTime;

function setup() {
  createCanvas(w, h);
  stroke(255);

  // Colors
  night = color('rgb(29, 55, 80)');
  day = color('rgb(238, 215, 135)');
  sunrise = color('rgb(224, 123,	129)');
  sunset = color('rgb(229, 154,	131)');
  sunriseTime = 5;
  noon = 12;
  sunsetTime = 19;

  var radius = min(width, height) / 2; // this is the maximum possible radius
  clockDiameter = radius * 1.7; // make slightly smaller than maximum allowed
  hourDiameter = ((clockDiameter * TWO_PI) / (24 * 2)) * .95; // largest diameter for 24
  minDiameter = (hourDiameter * TWO_PI) / (60 * 2);
  hourCirclePos = clockDiameter / 2;
  minCirclePos = hourDiameter / 2;

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
  var m = map(minute(), 0, 60, 0, TWO_PI) - HALF_PI;
  var h = map(hour(), 0, 24, 0, TWO_PI) - HALF_PI;

  var sunriseAngle = map(sunriseTime, 0, 24, 0, TWO_PI) - HALF_PI;
  var noonAngle = map(noon, 0, 24, 0, TWO_PI) - HALF_PI;
  var sunsetAngle = map(sunsetTime, 0, 24, 0, TWO_PI) - HALF_PI;

  // var m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
  // var h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI) - HALF_PI;

  // for debugging
  // fill(color('white'));
  // textAlign('center');
  // text('s: ' + s.toFixed(1) + ' m: ' + m.toFixed(1) + ' h ' + h.toFixed(1), cx, cy - 15);
  // text('s: ' + second() + ' m: ' + minute() + ' h ' + hour(), cx, cy);

  // Draw the hands of the clock
  stroke(255);
  strokeWeight(1);
  // line(cx, cy, cx + cos(s) * hourCirclePos, cy + sin(s) * hourCirclePos);

  // Draw the minute ticks
    beginShape(POINTS);
    var circleNumber = 0;
  for (var a = 0; a < 360; a+= 360/24) {
    var angle = radians(a) - HALF_PI;
    var x = cx + cos(angle) * hourCirclePos;
    var y = cy + sin(angle) * hourCirclePos;
    strokeWeight(3);
    stroke(80);
    fill(getHourFill(h, angle, circleNumber)); // fill with color if hour has past
    ellipse(x, y, hourDiameter, hourDiameter);

    fill(color('white')); // for debugging
    text(circleNumber, x, y);
    for (var b=0; b < 360; b+= 360/60){
      var subangle = radians(b) - HALF_PI;
      var subx = x + cos(subangle) * minCirclePos;
      var suby = y + sin(subangle) * minCirclePos;
      // strokeWeight(.5);
      noStroke();
      fill(getMinFill(h, m, angle, subangle, circleNumber));// fill(calculateColor(b)[1]);
      ellipse(subx, suby, minDiameter, minDiameter);
    }
    circleNumber+=1;
  }
  endShape();
}

function getHourFill(h, angle, circleNumber){
  var c = 0;
  if (angle < h) {c = calculateColor(circleNumber);}
  return c;
}

function getMinFill(h, m, angle, subangle, circleNumber){
  var c = 0;
  if (angle < h) {
    c = calculateColor(circleNumber);
  } else if (angle == h && subangle < m) {
    c = calculateColor(circleNumber);
  }
  return c;
}

function calculateColor(circleNumber){
  var startColor = night;
  var endColor = day;
  var colorScale = 0;

  if (circleNumber < (sunriseTime - 2) || circleNumber > (sunsetTime + 1)){// Night
    startColor = night;
    endColor = night;
    colorScale = 0; //to start color change at top
  } else if (circleNumber >= (sunriseTime - 2) && circleNumber < (sunriseTime)) { // Night>Sunrise
    startColor = night;
    endColor = sunrise;
    colorScale = map ((circleNumber), sunriseTime - 2, sunriseTime, 0, 1);
  } else if (circleNumber >= (sunriseTime) && circleNumber <= (noon - 2)) { // Sunrise>Noon
    startColor = sunrise;
    endColor = day;
    colorScale = map ((circleNumber), sunriseTime + 1, noon - 2, 0, 1);
  } else if (circleNumber > (noon - 2) && circleNumber <= (sunsetTime - 1)) { // Noon
    startColor = day;
    endColor = day;
    colorScale = 0;
  } else if (circleNumber > (sunsetTime - 1) && circleNumber <= (sunsetTime + 1)) { // Noon>Sunset
    startColor = day;
    endColor = sunset;
    colorScale = map ((circleNumber), sunsetTime - 1, sunsetTime + 1, 0, 1);
  } else if (circleNumber > (sunsetTime + 1)) { // Sunset>Night
    startColor = sunset;
    endColor = night;
    colorScale = map ((circleNumber), sunsetTime + 1, 24, 0, 1);
  }

  hourColor = lerpColor(startColor, endColor, colorScale);
  return hourColor;
}



// TODO add moonshape in the middle based on state of moon
// TODO calculate logic for what fill to use
