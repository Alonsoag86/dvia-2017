

var cx, cy;

var milisecondsRadius;
var secondsRadius;
var minutesRadius;
var hoursRadius;

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
  
//  var n = map (milisecond(), 0, 60, 0, MaxMilisecondsRadius);)
//  var s = map(second(), 0, 60, MaxMilisecondsRadius, maxSecondsRadius);
//  var m = map(minute(), 0, 60, maxSecondsRadius, maxMinutesRadius);
//  var h = map(hour(), 0, 24, maxMinutesRadius, maxHoursRadius);
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
  ellipse(cx, cy, milisecondsRadius, milisecondsRadius);

// Enlarge Circle Due to time
   var n = map (milisecond(), 0, 60, 0, MaxMilisecondsRadius);
   var s = map(second(), 0, 60, MaxMilisecondsRadius, maxSecondsRadius);
   var m = map(minute(), 0, 60, maxSecondsRadius, maxMinutesRadius);
   var h = map(hour(), 0, 24, maxMinutesRadius, maxHoursRadius);
  
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

  }
  endShape();
}
