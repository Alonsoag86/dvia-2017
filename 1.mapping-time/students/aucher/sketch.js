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
  frameRate(1);

  // Colors
  night = color('rgb(29, 55, 80)');
  day = color('rgb(238, 215, 135)');
  sunrise = color('rgb(224, 123,	129)');
  sunset = color('rgb(229, 154,	131)');
  sunriseTime = 6;
  sunsetTime = 18;

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

  // Angles for sin() and cos() start at 3 o'clock;
  // subtract HALF_PI to make them start at the top
  var m = map(minute(), 0, 60, 0, TWO_PI) - HALF_PI;
  // var h = map(hour(), 0, 24, 0, TWO_PI) - HALF_PI;
  var h = map(hour(), 0, 24, 0, TWO_PI) - HALF_PI;

  // Draw the minute ticks
    beginShape(POINTS);
    var circleNumber = 0;
  for (var a = 0; a <360; a+= 360/24) {
    var angle = radians(a) - HALF_PI;
    var x = cx + cos(angle) * hourCirclePos;
    var y = cy - sin(angle) * hourCirclePos; // subtract sine to get counterclockwise
    strokeWeight(3);
    stroke(80);
    fill(getHourFill(h, angle, circleNumber)); // fill with color if hour has past
    ellipse(x, y, hourDiameter, hourDiameter);

    // for debugging
    // fill(color('white'));
    // text(h.toFixed(1) + ' ' + angle.toFixed(1), x, y);
    for (var b = 0; b < 360; b+= 360/60){
      var subangle = radians(b) - HALF_PI;
      var subx = x + cos(subangle) * minCirclePos;
      var suby = y - sin(subangle) * minCirclePos;
      noStroke();
      fill(getMinFill(h, m, angle, subangle, circleNumber));
      ellipse(subx, suby, minDiameter, minDiameter);
    }
    circleNumber+=1;
  }
  endShape();
}

function getHourFill(h, angle, circleNumber){
  var c = 0;
  // if current circle angle is past the hour angle
  if (angle < h) {c = calculateColor(circleNumber);}
  return c;
}

function getMinFill(h, m, angle, subangle, circleNumber){
  var c = 0;
  // if current circle angle is past the hour angle
  if (angle < h) {
    c = calculateColor(circleNumber);
  }
   else if (angle.toFixed(1) == h.toFixed(1) && subangle < m) {// current hour, minute that has past
    c = calculateColor(circleNumber);
  }
  return c;
}

function calculateColor(circleNumber){
  var startColor = night;
  var endColor = day;
  var colorScale = 0;
  var gradientPadding = 2; // hours for the color transition

  if (circleNumber > (sunsetTime + gradientPadding || circleNumber < (sunriseTime - gradientPadding))){// Night
    startColor = night;
    endColor = night;
    colorScale = 0;

  } else if (circleNumber >= (sunriseTime - gradientPadding) && circleNumber < (sunriseTime)) {
    // Night>Sunrise
    startColor = night;
    endColor = sunrise;
    colorScale = map ((circleNumber), sunriseTime - gradientPadding, sunriseTime, 0, 1);

  } else if (circleNumber >= (sunriseTime) && circleNumber < (sunriseTime + gradientPadding)) {
    // Sunrise>Noon
    startColor = sunrise;
    endColor = day;
    colorScale = map ((circleNumber), sunriseTime, sunriseTime + gradientPadding, 0, 1);

  } else if (circleNumber >= sunriseTime + gradientPadding && circleNumber < (sunsetTime - gradientPadding)) {
    // Noon
    startColor = day;
    endColor = day;
    colorScale = 0;

  } else if (circleNumber >= (sunsetTime - gradientPadding) && circleNumber < (sunsetTime + gradientPadding)) {
    // Noon>Sunset
    startColor = day;
    endColor = sunset;
    colorScale = map ((circleNumber), sunsetTime - gradientPadding, sunsetTime + gradientPadding, 0, 1);

  } else if (circleNumber >= (sunsetTime)) {
    // Sunset>Night
    startColor = sunset;
    endColor = night;
    colorScale = map ((circleNumber), sunsetTime, 21, 0, 1);
  }

  hourColor = lerpColor(startColor, endColor, colorScale);
  return hourColor;
}
