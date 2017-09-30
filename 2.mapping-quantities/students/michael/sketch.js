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

// mouse event
// noinfo msg
// TODO: Bounding Bar?
// dont draw tag when too small
// draw info when pcentView is 0;
function drawBars(title, vals) {
  var cIdx = 0;
  
  for (var yidx=0; yidx < vals.length; yidx++) {
    
    var curY = barY + (barHeight + barSpacer)*yidx;
    var curX = barX;
    var bMax = 0;
    
    var bUnit = (1.0 * barWidth) / vals[yidx].reduce(sum);  // get base fraction of pixels   
      
    push();  // Bounding Bar
    stroke(grey);
    strokeWeight(3.0);
    noFill();
    //rect(curX - 5, curY - 5, barWidth + barBuf, barHeight + barBuf, bCurve, bCurve, bCurve, bCurve);
    pop()
    
    push()
    for (var xidx = 0; xidx < vals[yidx].length; xidx++, curX+=curWidth) {
      var lCurve = 0;
      var rCurve = 0;
     
      if (xidx == 0)
        lCurve = bCurve;
        
      if (xidx == vals[yidx].length - 1)
        rCurve = bCurve;
        
      var curTag = 0;
      
      c = bColors[xidx%bColors.length];
      stroke(c);
      fill(c);
      if (vals[yidx][xidx].length == undefined) {  // No tag
        var curVal = vals[yidx][xidx];
      } else { // Has tag
        var curTag = vals[yidx][xidx][0];
        var curVal = vals[yidx][xidx][1];
      }
          
      if (bMax < curVal)
        bMax = curVal;
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
      }
         
      pop();
    }
    
    //textFont("Helvetica", textHeight); // BUG: Why is AA so smudgy?
    textSize(textHeight);
    textAlign(LEFT);
    stroke(grey);
    fill(grey);
    if (title.length)
      text(title[yidx] + ": " + bMax, barX, curY - 10);
  }
}




function setup() {
  bColors = [color("#005548"), color("#7D3051"), color("#2F1F26"), color("#262E35"), color("#783D28"), color("#49000D"), color("#6F6473"), color("#86414F"), color("#357157"), color("#00617E"), color("#7A6333"), color("#77242A"), color("#3E3E24"), color("#7E7E36"), color("#445B1C"), color("#3F342F"), color("#783D28"), color("#7A6333")];

  gWidth = windowWidth; // set global width
  createCanvas(windowWidth, windowHeight);
  
  values = [[5,7,22,2,6,8,22,5,7,2,6,8], [5,3,2,6,8,22,5,7,22,2,6,8], [["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5]]];
  labels = ["Magnitude", "Population", "Stations"];
  
  frameRate(25);
}



function update() {
  barWidth = gWidth - 200;
  
  values = [[5,7,22,2,6,8,22,5,7,2,6,8], [5,3,2,6,8,22,5,7,22,2,6,8], [["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5], ["mx", 2], ["us", 3], ["at", 5]]];
  labels = ["Magnitude", "Population", "Stations"];

  println(eventX + " " + eventY + " " + pcentView + " " + isEvent);
    
  // if event is active, change the percent of other bars we view
  if (!isEvent && pcentView != 100) {
    pcentView+=4;
    if (pcentView > 100) pcentView = 100;
  }
  
  if (isEvent) {
    pcentView-=4;
    if (pcentView < 0) pcentView = 0;

    //if (pcentView == 100)  // PROBLEM HERE
    //  eventY = -1 // disable the event
  } 
  
  for (var yidx = 0; yidx < values.length; yidx++)
    for (var xidx = 0; xidx < values[yidx].length; xidx++)
      if (xidx != eventX && yidx != eventY) //  && yidx != 2)         
        if (values[yidx][xidx].length == undefined) {  // No tag
          values[yidx][xidx] = map(pcentView, 0, 100, 0, values[yidx][xidx]); 
        } else { // Has tag
          values[yidx][xidx][1] = map(pcentView, 0, 100, 0, values[yidx][xidx][1]);
        }
   isEvent = false;
}

function draw() {
  update();

  background(0);
  drawBars(labels, values);
}

function windowResized() {
  gWidth = windowWidth; // set global width
  resizeCanvas(windowWidth, windowHeight);
}
