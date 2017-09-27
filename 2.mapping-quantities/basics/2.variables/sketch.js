// Variables are used for storing values. In this example, change the values of variables to affect the composition.
// in this example all drawing happens only in setup(), so it is only drawn once.
function setup() {

  createCanvas(720, 400);
  background(0);
  stroke(153);
  strokeWeight(4);
  
  // change these variables to see how the composition is affected
  var a = 50;
  var b = 120;
  var c = 180;

  // line works like this:
  // line(x1, y1, x2, y2);
  line(a, b, a+c, b);
  line(a, b+10, a+c, b+10);
  line(a, b+20, a+c, b+20);
  line(a, b+30, a+c, b+30);

  // now the variables are changed
  a = a + c;
  b = height-b;

  line(a, b, a+c, b);
  line(a, b+10, a+c, b+10);
  line(a, b+20, a+c, b+20);
  line(a, b+30, a+c, b+30);

  a = a + c;
  b = height-b;

  line(a, b, a+c, b);
  line(a, b+10, a+c, b+10);
  line(a, b+20, a+c, b+20);
  line(a, b+30, a+c, b+30);
}