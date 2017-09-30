// define a global variable to hold our USGS data
var table

function preload() {
  // load data from either a local copy of one of the USGS CSVs or directly:
  table = loadTable("assets/significant_month.csv", "csv", "header");
  // or (while you're designing) from the feed itself:
  // table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");
}

/* TODO
fix multibar
add map
add legend
add text area
add timescale
write number circles
*/

gWidth = 1000;
height = 0;
transparent = 0;

barWidth = gWidth;
barHeight = 30;
barSpacer = 40;
barBuf = 10;
barX = 50;
barY = 50;
textHeight = barHeight / 2;
bColors = [];
bCurve = 5;
grey = 200

bMax = [];  // maximums for each bar

isEvent = false;
eventX = eventY = 0;
pcentView = 100;

// our data
labels = [];
values = [];

/*

// takes dict of key/val pairs and bars em
dict.push({
    key:   "keyName",
    value: "the value"
});
var dict = {};
dict.key1 = "value1";
dict.key2 = "value2";
*/

// sum vals of array for .reduce()
function sum(total, num) {
    if (num.length == undefined) {  // No tag
      return total + num;
    } else { // Has tag
      if (total.length == undefined)
        return total + num[1];
      else
        return total[1] + num[1];
    }
}

// stackexchange collide alg
function mouseCollide (pointX, pointY, x, y, xW, yW) {
  if (pointX >= x &&       // right of the left edge AND
    pointX <= x + xW &&    // left of the right edge AND
    pointY >= y &&         // below the top AND
    pointY <= y + yW) {    // above the bottom
      return true;
  }
  return false;
};

c = 0; // Unbelievable. (color object)

// Alpha change on existing color. Really hacky.
function setAlpha(myC, a) {
  r = red(myC);
  g = green(myC);
  b = blue(myC);
  
  return c(r,g,b,a);
}

// translate/rotate does not work for mouseX/Y!
// gotta provide manual bounding boxes!
function drawMenu(vals, bboxes, bX, bY, r, c) {
  
  for (var xidx = 0; true && xidx < vals.length; xidx++) { // debug
    stroke(111);
    noFill();
    rect(bboxes[xidx][0], bboxes[xidx][1], bboxes[xidx][2], bboxes[xidx][3]);
  }
  
  push();
  angleMode(DEGREES);
  translate(bX, bY);
  rotate(r);
  
    var curY = 0;
    var curX = 0;
    
    for (var xidx = 0; xidx < vals.length; xidx++, curX+=curWidth) {

      var c = bColors[xidx%bColors.length];
      stroke(c);
      fill(c);
      
      var lCurve = 0;
      var rCurve = 0;
     
      if (xidx == 0)
        lCurve = bCurve;
        
      if (xidx == vals.length - 1)
        rCurve = bCurve;
          
      var curWidth = 100;
      
      if (mouseCollide (mouseX, mouseY, bboxes[xidx][0], bboxes[xidx][1], bboxes[xidx][2], bboxes[xidx][3])) {
        println(xidx);
      }       
      
      rect(curX, curY, curWidth, barHeight, lCurve, rCurve, rCurve, lCurve);
        
      textAlign(CENTER);
      stroke(grey, 120);
      fill(grey, 120);      
      text(vals[xidx], curX + curWidth/2, curY + ((barHeight + barBuf)/2));
    }
   pop(); 
}


// noinfo msg
// TODO: Bounding Bar?
function drawBars(title, vals) {
  
  for (var yidx=0; yidx < vals.length; yidx++) {
    
    var curY = barY + (barHeight + barSpacer)*yidx;
    var curX = barX;
    
    var bUnit = (1.0 * barWidth) / vals[yidx].reduce(sum);  // get base fraction of pixels   
      
    push();  // Bounding Bar
    stroke(grey);
    strokeWeight(3.0);
    noFill();
    //rect(curX - 5, curY - 5, barWidth + barBuf, barHeight + barBuf, bCurve, bCurve, bCurve, bCurve);
    pop()
    
    push()
    for (var xidx = 0; xidx < vals[yidx].length; xidx++, curX+=curWidth) {
      var curTag = 0;
      
      var c = bColors[xidx%bColors.length];
      stroke(c);
      fill(c);
      
      var lCurve = 0;
      var rCurve = 0;
     
      if (xidx == 0)
        lCurve = bCurve;
        
      if (xidx == vals[yidx].length - 1)
        rCurve = bCurve;
      
      if (pcentView < 100 && eventX == xidx && eventY != yidx) {
        lCurve = map(pcentView, 100, 0, 0, bCurve);
        rCurve = map(pcentView, 100, 0, 0, bCurve);
      }
      
      if (pcentView < 100 && eventX != xidx && eventY != yidx) {
        var a = map(pcentView, 0, 100, 0, 255);
        stroke(setAlpha(c, a));  // stupid way to change alpha
        fill(setAlpha(c, a));  
      }      
     
      /*
      if (isEvent && eventX == xidx) { // && eventY == yidx) {
        lCurve = bCurve;
        rCurve = bCurve;
      }*/
      
      if (vals[yidx][xidx].length == undefined) {  // No tag
        var curVal = vals[yidx][xidx];
      } else { // Has tag
        var curTag = vals[yidx][xidx][0];
        var curVal = vals[yidx][xidx][1];
      }
          
      var curWidth = curVal*bUnit;
      
      if (mouseCollide (mouseX, mouseY, curX, curY, curWidth, barHeight)) {
        isEvent = true;
        eventX = xidx;
        eventY = yidx;
      }       
      
      rect(curX, curY, curWidth, barHeight, lCurve, rCurve, rCurve, lCurve);
        
      textAlign(CENTER);
      var a = xidx==eventX||yidx==eventY?120:pcentView;
      stroke(grey, a);
      fill(grey, a);      
      if (curTag) { // if a tag exists, print it
        text(curTag, curX + curWidth/2, curY + ((barHeight + barBuf)/2));
      } else {
        a = pcentView<100 && eventX==xidx?120-pcentView:0;      
        stroke(grey, a);
        fill(grey, a);
        text(vals[yidx][xidx], curX + curWidth/2, curY + ((barHeight + barBuf)/2));
      }
         
      pop();
    }
    
    //textFont("Helvetica", textHeight); // BUG: Why is AA so smudgy?
    textSize(textHeight);
    textAlign(LEFT);
    stroke(grey);
    fill(grey);
    if (title.length)
      text(title[yidx] + ": " + bMax[yidx], barX, curY - 10);
      
  }
  pop();
}




function setup() {
  bColors = [color("#005548"), color(0,0,255, 200), color("#7D3051"), color("#2F1F26"), color("#262E35"), color("#783D28"), color("#49000D"), color("#6F6473"), color("#86414F"), color("#357157"), color("#00617E"), color("#7A6333"), color("#77242A"), color("#3E3E24"), color("#7E7E36"), color("#445B1C"), color("#3F342F"), color("#783D28"), color("#7A6333")];

  c = color; // Really?!?

  gWidth = windowWidth; // set global width
  createCanvas(windowWidth, windowHeight);
  
  values = [[5,7,22,2,6,8,22,5,7,2,6,8], [5,3,2,6,8,22,5,7,22,2,6,8], [["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5]]];
  labels = ["Magnitude", "Population", "Stations"];
  
  frameRate(25);
}

function update() {
  barWidth = gWidth - 200;
  bMax = new Array(values.length).fill(0);
  
  values = [[5,7,22,2,6,8,22,5,7,2,6,8], [5,3,2,6,8,22,5,7,22,2,6,8], [["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5]]];
  labels = ["Magnitude", "Population", "Stations"];

  // println(eventX + " " + eventY + " " + pcentView + " " + isEvent);
    
  // if event is active, change the percent of other bars we view
  if (!isEvent && pcentView != 100) {
    pcentView+=4;
    if (pcentView > 100) pcentView = 100;
  }
  
  if (isEvent) {
    pcentView-=4;
    if (pcentView < 0) pcentView = 0;
  } 
  
  for (var yidx = 0; yidx < values.length; yidx++)
    for (var xidx = 0; xidx < values[yidx].length; xidx++) {
      if (values[yidx][xidx].length == undefined) {  // No tag
        if (bMax[yidx] < values[yidx][xidx]) bMax[yidx] = values[yidx][xidx];
      } else { // Has tag
        if (bMax[yidx] < values[yidx][xidx][1]) bMax[yidx] = values[yidx][xidx][1];
      }
    
      if (xidx != eventX && yidx != eventY) {       
        if (values[yidx][xidx].length == undefined) {  // No tag
          values[yidx][xidx] = map(pcentView, 0, 100, 0, values[yidx][xidx]);
        } else { // Has tag
          values[yidx][xidx][1] = map(pcentView, 0, 100, 0, values[yidx][xidx][1]);
        }
      }
    }
   isEvent = false;
}

function draw() {
  update();

  background(0);
  menu = ["Hourly", "Daily", "Weekly", "Monthly"];
  bboxes = [[100, 700, 40, 60], [100, 600, 40, 60], [100, 500, 40, 60], [100, 400, 40, 60]]
  drawMenu(menu, bboxes, 100, 700, -90, bColors);
  
  drawBars(labels, values);
}

function windowResized() {
  gWidth = windowWidth; // set global width
  resizeCanvas(windowWidth, windowHeight);
}
