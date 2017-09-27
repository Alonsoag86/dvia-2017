//a numbers array
var years = [1980, 1984, 1988];

//a string array
var cities = ["Moscow", "Los Angeles", "Seoul"];

//a boolean array (true or false)
var winUSA = [false, true, false];

// starting position for the drawing
var xPos = 50;
var yPos = 50;

// setup
function setup(){

  createCanvas(800, 600);
  textSize(20);

  // writing the headers
  textStyle(BOLD);
  text("Year", xPos, yPos);
  text("City", xPos+150, yPos);
  text("Was US the top nation?", xPos+300, yPos);

  // writing the 3 columns in rows
  textStyle(NORMAL);

  yPos = yPos+30;

  for(var i=0; i<3; i++){
    text(years[i], xPos, yPos+i*30);
    text(cities[i], xPos+150, yPos+i*30);
    text(winUSA[i], xPos+300, yPos+i*30);
  }
}