/*
An array is a list of data. Each piece of data in an array is identified by an index number
representing its position in the array. Arrays are zero based, which means that the first
element in the array is [0], the second element is [1], and so on. In this example, an array
named "coswav" is created and filled with the cosine values. This data is displayed three
separate ways on the screen.
*/

// in the beginning the array is empty, there is nothing in the list
var coswave = [];

function setup() {

  createCanvas(720, 360);

  // we create values for the array in a for loop
  for (var i = 0; i < width; i++){

    // map `i` (0 to 720) to `amount` (0 to PI)
    var amount = map(i, 0, width, 0, PI);

    // get the cosine (-1 to 1) of the amount and assign
    // its absolute value (0 to 1) to the array
    coswave[i] = abs(cos(amount));
  }
  // after the loop is complete, the coswave array will have values of 1
  // at its beginning and end and gradually decline to a value of 0 at its
  // midpoint. We'll use this range of values below to draw some gradients.

  background(255);
  noLoop();
}

function draw() {
  // try setting this to 3 to remove the space between lines
  strokeWeight(1)

  // draw the top row
  var y1 = 0;
  var y2 = height/3;
  for (var i = 0; i < width; i+=3) {
    stroke(coswave[i]*255);
    line(i, y1, i, y2);
  }

  // draw the middle row
  y1 = y2;
  y2 = y1 + y1;
  for (var i = 0; i < width; i+=3) {
    stroke(coswave[i]*255 / 4);
    line(i, y1, i, y2);
  }

  // draw the bottom row
  y1 = y2;
  y2 = height;
  for (var i = 0; i < width; i+=3) {
    stroke(255 - coswave[i]*255);
    line(i, y1, i, y2);
  }
}