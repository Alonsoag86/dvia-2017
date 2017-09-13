function setup() {
  createCanvas(800,450);
}

function draw() {
  background(100);

  //chain
  stroke(0);
  strokeWeight(5);
  line(400,325,300,300);
  line(400,275,300,300);

  //gears and pedals
  strokeWeight(10);
  fill(100);
  ellipse(400,300,50,50); //gear
  //pedal #1 - down
  line(400,300,400,350);
  line(390,350,410,350);
  //pedal #2 - down
  line(400,300,400,250);
  line(390,250,410,250);

  //frame color based on hour
  var hr = hour()
  if (hr > 11) {
    var hr = hr - 12;
  }

  var red = color(255,0,0);
  var yellow = color(255,255,0);
  var blue = color(0,0,255);

  var h1 = map(hr,0,6,0,1);
  var h2 = map(hr,6,11,0,1);

  var framecolor1 = lerpColor(yellow,red,h1);
  if (hour() < 12) {
    var framecolor1 = lerpColor(blue,red,h2);
  } //if AM, switch the yellow and blue

  var framecolor2 = lerpColor(red,blue,h2);
  if (hour() < 12) {
    var framecolor2 = lerpColor(red,yellow,h2);
  } //if AM, switch the yellow and blue

  if (hr > 5) {
     framecolor = framecolor2
  } else {
    framecolor = framecolor1
  }

  //frame color legend
  strokeWeight(0);
  for (i=0;i<6;i++) {
    function legendh(i) {
      return map(i,0,6,0,1);
    }
    var legendcolor = lerpColor(yellow,red,legendh(i));
    if (hour() < 12) {
      var legendcolor = lerpColor(blue,red,legendh(i));
    } //if AM, switch the yellow and blue
    fill(legendcolor);
    rect((250)+(25*i),425,25,25);
  }
  for (i=6;i<12;i++) {
    function legendh(i) {
      return map(i,6,11,0,1);
    }
    var legendcolor = lerpColor(red,blue,legendh(i));
    if (hour() < 12) {
      var legendcolor = lerpColor(red,yellow,legendh(i));
    } //if AM, switch the yellow and blue
    fill(legendcolor);
    rect((250)+(25*i),425,25,25);
  }

  //frame
  strokeWeight(10);
  stroke(framecolor);
  fill(255);
  line(600,70,600,190); //stem from front wheel to handlebars
  line(600,80,300,80); //top frame
  line(600,100,400,300); //front tube to pedals
  line(300,80,400,300); //back tube to pedals
  line(300,300,400,300); //pedals to back wheel
  line(300,80,200,300); //back tube to pedals
  line(300,60,300,80) // back tube to seat

  var seccolor = 255;
  if (hour() > 11) {
    var seccolor = 0;
  }

  //saddle
  stroke(seccolor);
  triangle(250,60,250,50,325,60);

  //handlebars
  line(650,70,595,70); //tube to handlebars
  noFill();
  arc(645,120,100,100,-HALF_PI,HALF_PI); //handlebars


  //wheels
  stroke(0);
  strokeWeight(1);
  fill(0);
  ellipse(200,290,200,200);
  ellipse(600,290,200,200);
  fill(100);
  ellipse(200,290,185,185);
  ellipse(600,290,185,185);

  //spokes
  var x1 = 200;
  var x2 = 600;
  var y = 290;
  var r = 90;

  stroke(200);
  strokeWeight(2);
  for (i=0;i<59;i++) {
    line(x1,y,x1 + cos(s(i)) * r,y + sin(s(i)) * r);
    line(x2,y,x2 + cos(s(i)) * r,y + sin(s(i)) * r);
  }
  function s(i) {
    return map(i, 0, 59, 0, TWO_PI) - HALF_PI;
  }

  stroke(255);
  //strokeWeight(3);
  if (minute()==0) {
    stroke(framecolor);
    line(x1,y,x1 + cos(s(second())) * r,y + sin(s(second())) * r);
    line(x2,y,x2 + cos(s(second())) * r,y + sin(s(second())) * r);
  } else if (minute()==59) {
    stroke(0);
    line(x1,y,x1 + cos(s(second())) * r,y + sin(s(second())) * r);
    line(x2,y,x2 + cos(s(second())) * r,y + sin(s(second())) * r);
  } else {
    for (i=second();i<minute()+second();i++) {
      line(x1,y,x1 + cos(s(i)) * r,y + sin(s(i)) * r);
      line(x2,y,x2 + cos(s(i)) * r,y +  sin(s(i)) * r);
    }
  }
/*
  for (i=0;i<15;i++) {
    if (second() > 14) {
      line(x2,y,x2 + cos(s(i)) * r,y +  sin(s(i)) * r);
    }
  }
  for (i=0;i<30;i++) {
    if (second() > 29) {
      line(x2,y,x2 + cos(s(i)) * r,y +  sin(s(i)) * r);
    }
  }
  for (i=0;i<45;i++) {
    if (second() > 44) {
      line(x2,y,x2 + cos(s(i)) * r,y +  sin(s(i)) * r);
    }
  }
  for (i=0;i<59;i++) {
    if (second() == 59) {
      line(x2,y,x2 + cos(s(i)) * r,y +  sin(s(i)) * r);
    }
  }
*/


  //line(600, 290, 600 + cos(s(minute())) * 90, 290 + sin(s(minute())) * 90);


}
