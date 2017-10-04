// starting position for the drawing
var xPos = 50;
var yPos = 50;


var table;



function preload() {
  table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");
}

function setup() {
  createCanvas(1200, 4800);
  textSize(10);

  println(table);

  // textStyle(BOLD);
  // for (var c = 0; c < table.getColumnCount(); c++) {
  //   text(table.getString(0, c), xPos + c*150, yPos);
  // }

  // yPos = yPos+5;

  textStyle(BOLD);
  textSize(30);
  fill(100,100,255)
  text("Earthquakes within past month", 100, 50);

  textStyle(NORMAL);
  colorMode(RGB);

  var place = table.getColumn("place");
  println(place);

  var mag = table.getColumn("mag");
  println(mag);
  // text(table.getString(1, 13), 200, 200);

  for (var r = 1; r < table.getRowCount(); r++) {
  var rowAlpha = table.getNum(r, 4)*30;
  // println(rowAlpha);
  fill(0,0,0,rowAlpha);
  textSize(rowAlpha/8);
  text(table.getString(r, 13), 100, 100 + r*40);}


  for (var r = 1; r < table.getRowCount(); r++) {
  var rowAlpha = table.getNum(r, 4)*30;
  // println(rowAlpha);
  fill(0,0,0,rowAlpha);
  textSize(rowAlpha/8);
  // fill(0,0,0,.2);
  text(table.getString(r, 4), 800, 100 + r*40);}



    //cycle through the table
  // for (var r = 1; r < table.getRowCount(); r++){
  //   for (var c = 0; c < table.getColumnCount(); c++) {
  //   text(table.getString(r, c), xPos + c*150, yPos+r*15);
  //   }
  // }
}