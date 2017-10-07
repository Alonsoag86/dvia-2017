
var cx, cy;


var MaxMilisecondsRadius;
var MaxSecondsRadius;
var MaxMinutesRadius;
var MaxHoursRadius;

var radius

function setup() {
  createCanvas(700, 700);
  stroke(0);

  radius = min(width, height) / 2;
  MaxMilisecondsRadius = radius * 0.20;
  MaxSecondsRadius = radius * 0.40;
  MaxMinutesRadius = radius * 0.6;
  MaxHoursRadius = radius * 0.8;




  cx = width / 2;
  cy = height / 2;

   console.log("Hello Hours",MaxHoursRadius)
   console.log("Hello Min",MaxMinutesRadius)
   console.log("Hello Sec",MaxSecondsRadius)

}

function draw() {
  background(226, 196, 173);


//backgrounds//


 fill(0,0,102);
 noStroke();
 ellipse(cx, cy, MaxHoursRadius, MaxHoursRadius);

 fill(0,102,102);
 noStroke();
 ellipse(cx, cy, MaxMinutesRadius, MaxMinutesRadius);

 fill(0, 102, 0);
 noStroke();
 ellipse(cx, cy, MaxSecondsRadius, MaxSecondsRadius);

 fill(0,0,0);
 noStroke();
 ellipse(cx, cy, MaxMilisecondsRadius, MaxMilisecondsRadius);

// change //

 fill(0,102,225);
 noStroke();
 var ringwidth = MaxHoursRadius - MaxMinutesRadius;
 var hourradius = (hour() / 24.0 * ringwidth) + MaxMinutesRadius
 ellipse(cx, cy, hourradius, hourradius);

 fill(0,102,102);
 ellipse(cx, cy, MaxMinutesRadius, MaxMinutesRadius);


 fill(0,255,255);
 noStroke();
 var ringwidth = MaxMinutesRadius - MaxSecondsRadius;
 var hourradius = (minute() / 60.0 * ringwidth) + MaxSecondsRadius
 ellipse(cx, cy, hourradius, hourradius);

 fill(0, 102, 0);
 ellipse(cx, cy, MaxSecondsRadius, MaxSecondsRadius);


 fill(0, 255, 102);
 noStroke();
 var ringwidth = MaxSecondsRadius - MaxMilisecondsRadius;
 var hourradius = (second() / 60.0 * ringwidth) + MaxMilisecondsRadius
 ellipse(cx, cy, hourradius, hourradius);

 fill(0,0,0);
 ellipse(cx, cy, MaxMilisecondsRadius, MaxMilisecondsRadius);
}
