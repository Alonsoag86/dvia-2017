// define a global variable to hold our USGS data
var table

function preload() {
  // load data from either a local copy of one of the USGS CSVs or directly:
  table = loadTable("assets/significant_month.csv", "csv", "header");
  // or (while you're designing) from the feed itself:
  // table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");
}

barWidth = 400;
barHeight = 30;
barSpacer = 20;
barX = 50;
barY = 50;
bColors = [];
bCurve = 5;

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

function sum(total, num) {
    return total + num;
}

function drawBar(title, vals) {
  var cIdx = 0;
  
  for (var yidx=0; yidx < vals.length; yidx++) {
  
    

    var bUnit = (1.0 * barWidth) / vals[yidx].reduce(sum);  // get base fraction of pixels 
    println(barX);
    println(barY + (barHeight + barSpacer)*yidx);
    println(vals[yidx]*bUnit);
    
    curY = barY + (barHeight + barSpacer)*yidx;
    curX = barX;
    
    stroke(100);
    strokeWeight(3.0);
    noFill();
    rect(curX - 5, curY - 5, barWidth + 10, barHeight + 10, bCurve, bCurve, bCurve, bCurve);
    
    for (var xidx = 0; xidx < vals[yidx].length; xidx++, curX+=curWidth) {
      var lCurve = 0;
      var rCurve = 0;
      
      if (xidx == 0)
        lCurve = bCurve;
        
      if (xidx == vals[yidx].length - 1)
        rCurve = bCurve;
        
      c = bColors[xidx%bColors.length];
      stroke(c);
      fill(c);
      var curWidth = vals[yidx][xidx]*bUnit;
      rect(curX, curY, curWidth, barHeight, lCurve, rCurve, rCurve, lCurve);
    }
  }
}

function setup() {
  bColors = [color(0,0,255), color(0,255,0), color(255,0,0)];
// var v = [["mx", 2], ["us", 3], ["at", 5]]
var v = [[5,7,22,3,2,6,8], [5,3,2,6,8,7,22]];
var t = ["Magnitude","Population"];


  createCanvas(windowWidth, windowHeight);

drawBar(t, v);
}

function draw() {

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
