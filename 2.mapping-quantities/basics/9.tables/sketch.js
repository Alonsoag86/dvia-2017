// Given the following CSV file called "olympics.csv"
// located in the project's "assets" folder:
// year,city,winUSA
// 1980,"Moscow",false
// 1984,"Los Angeles",true
// 1988,"Seoul",false

// starting position for the drawing
var xPos = 50;
var yPos = 50;

var table;

function preload() {
  // table is comma separated value "csv" file and has a header specifying the columns labels
  // passing "header" as the final argument means that the resulting table object will exclude
  // that header row from the data for us
  table = loadTable("assets/olympics.csv", "csv", "header");
}

function setup() {
  createCanvas(800, 600);
  textSize(20);

  // dump the table to the console
  println(table);

  //count the columns
  println(table.getRowCount() + " total rows in table");
  println(table.getColumnCount() + " total columns in table");

  // write the headers
  textStyle(BOLD);
  text("Year", xPos, yPos);
  text("City", xPos+150, yPos);
  text("Was US the top nation?", xPos+300, yPos);

  // set the text style back to normal
  textStyle(NORMAL);

  // add vertical distance between header and rows
  yPos = yPos+30;

  //cycle through the table
  for (var r = 0; r < table.getRowCount(); r++){
    for (var c = 0; c < table.getColumnCount(); c++) {
      text(table.getString(r, c), xPos + c*150, yPos+r*30);
    }
  }
}