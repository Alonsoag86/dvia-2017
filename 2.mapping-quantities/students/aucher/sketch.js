// sources: https://github.com/fraxen/tectonicplates
// projection adapted from:  https://en.wikipedia.org/wiki/Web_Mercator
// with help from: https://www.youtube.com/watch?v=ZiYdOwOrGyc
var table, mapImg;

var  pictureH = 512,
  pictureW = 1024,
  imageScale = 1.25,
  canvasW = pictureW * imageScale + 200,
  canvasH = pictureH * imageScale + 100;
  // canvasW = window.innerWidth,
  // canvasH = window.innerHeight;

var cx, cy;

var maxDepth, minDepth, today, maxDateDiff, minDateDiff;
var startColor, endColor, midColor;

// PRELOAD
function preload() {
  // load data from either a local copy of one of the USGS CSVs or directly:
  // table = loadTable("assets/significant_month.csv", "csv", "header");
  mapImg = loadImage('assets/techtonicMap.png');
  table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");
}

// SETUP
function setup() {
  println(table.rows);
  startColor = color(174, 46, 56);
  endColor = color(135, 146, 149);
  midColor = color(254, 195, 42);

  // FIND MAG and DEPTH EXTREMA
  var mags = [];
  var depths = [];
  var dateDiffs = [];
  for (var r in table.rows){
      var thisPoint = table.rows[r].obj;
      thisPoint.dateDiff = dateDiff(new Date(thisPoint.time));
      depths.push(float(thisPoint.depth));
      dateDiffs.push(thisPoint.dateDiff);
  }
  maxDepth = max(depths);
  minDepth = min(depths);
  maxDateDiff = max(dateDiffs);
  minDateDiff = min(dateDiffs);

  // add title and other html elements to page
  createElement('h1','Recent Significant Seismic Events');
  createElement('h2', table.rows.length + ' Significant Seismic Events in the Last ' + maxDateDiff + ' Days');
  createElement('p', '(hover over circle to see details)' );
  createCanvas(canvasW, canvasH);
  var div = createElement('div');
  createElement('p','Sources:');
  createElement('p','seismic data comes from the <a href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php">USGS</a> live feed');
  createElement('p','map comes from the <a href="https://www.mapbox.com/">Mapbox</a>');
  createElement('p','techtonic plate data comes from the <a href="https://github.com/fraxen/tectonicplates">Fraxen\'s Repository</a> with reference to the work of Hugo Ahlenius, Nordpil and Peter Bird');
  frameRate(5);

  // CREATE NEW BURSTS FOR DATA
  for (var r in table.rows){
    var thisPoint = table.rows[r].obj;
    thisPoint.coords = getCoords(thisPoint.latitude, thisPoint.longitude);
    thisPoint.burst = new circleBurst(thisPoint.coords.x, thisPoint.coords.y, thisPoint.mag, thisPoint.depth, thisPoint.dateDiff, thisPoint.place);
    thisPoint.burst.display();
  }
}

// DRAW
function draw() {
  background(250, 250, 250);
  gradient();
  // translate into center of canvas
  translate( width/2, (canvasH) / 2);
  imageMode(CENTER);
  image(mapImg, 0, 0, mapImg.width*imageScale, mapImg.height*imageScale); // image of map

  // iterate through bursts and display them
  for (var r in table.rows){
    // println(table.rows[r].obj.burst);
    table.rows[r].obj.burst.display();
  }
}


function circleBurst(xPos, yPos, mag, depth, dateDiff, place){
  var startDiam = map(depth, minDepth, maxDepth, 5, 10);
  var colorScale;
  var colorMidpoint = minDateDiff + (maxDateDiff - minDateDiff)/2
  if (dateDiff <= colorMidpoint){
    colorScale = map(dateDiff, minDateDiff, colorMidpoint, 0, 1);
    this.color = lerpColor(startColor, midColor, colorScale);
  }else {
    colorScale = map(dateDiff, colorMidpoint, maxDateDiff, 0, 1);
    this.color = lerpColor(midColor, endColor, colorScale);
  }

  var numCircles = 5;
  var stepDiameter = map(mag, 0, 10 ,0, 15);
  var diameters = [];

  this.x = xPos;
  this.y = yPos;
  this.mag = mag;
  this.startDiam = startDiam;
  this.maxDiam = startDiam + (stepDiameter * (numCircles));
  this.place = place;
  this.dateDiff = dateDiff;
  this.hover = false;

  // fill in diameters array
  for (var i = 1; i <= numCircles; i++){ diameters.push(startDiam + (stepDiameter * (i - 1)));}
  this.diameters = diameters;

  this.checkHover = function (){
    this.hover = false;
    var x = mouseX - width/2; // account for the transform
    var y = mouseY - (canvasH / 2);
    var d = dist(x, y, this.x, this.y)
    if (d <= 10 ){
      this.hover = true;
    }
  }

  // DISPLAY FUNCTION
  this.display = function(){

    fill(this.color); // inner most circle
    ellipse(this.x, this.y, startDiam, startDiam);
    // concentric circles
    for (var c in diameters){
      this.diameters[c] = (this.diameters[c] >= this.maxDiam) ? this.startDiam : this.diameters[c] + 1
      var opacity = map(this.diameters[c], this.maxDiam / 2, this.maxDiam, 255, 0);

      noFill();
      adjColor = color(this.color.levels[0], this.color.levels[1], this.color.levels[2], opacity);
      strokeWeight(1.5);
      stroke(adjColor);
      ellipse(this.x, this.y, this.diameters[c], this.diameters[c]);
    }

    // if mouse is over burst, call the tooltip
    this.checkHover();
    if (this.hover) {
      tooltip(this);
    }
  };
};


function mercX(lon){
  lon = radians(lon);
  var a = (pictureH / PI);// * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat){
  lat = radians(lat);
  var a = (pictureH / PI);// * pow(2, zoom);
  var b = tan(PI/4 + lat/2);
  var c = PI - log(b);
  return a * c;
}

function getCoords(lat, lon){
  // center coordinates
  var clat = 0,
  clon = 0;
  coords = new Object;
  cx = mercX(clon),
  cy = mercY(clat);

  // calculate
  coords.x = (mercX(lon) - cx) * imageScale,
  coords.y = (mercY(lat) - cy) * imageScale;
  return coords;
}

function dateDiff(d){
  today = new Date(Date.now());
  var timeDiff = Math.abs(d.getTime() - today.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return diffDays;
}

function tooltip(d){
  var size = 15;
  var mousebuffer = 5;
  noStroke();
  fill('black');
  textFont('monospace', size);
  textAlign(CENTER);
  text('Magnitude: ' + d.mag, d.x + mousebuffer, d.y - (3 * size));
  text(d.place, d.x + mousebuffer, d.y - (2 * size));
  textSize(size - 3);
  text('(' + d.dateDiff + ' days ago)', d.x + mousebuffer, d.y - size);
}

function gradient(){
  var w = 150;
  var h = 30;
  var x = width/2 - w/2;
  var y = height - (h * .75);
  var padding = 10;
  var colorMidpoint = x + w/2;
  var colorScale, c;
  for (var i = x; i <= x + w; i++){
    if (i <= colorMidpoint){
      colorScale = map(i, x, colorMidpoint, 0, 1);
      c = lerpColor(startColor, midColor, colorScale);
    }else {
      colorScale = map(i, colorMidpoint, x + w, 0, 1);
      c = lerpColor(midColor, endColor, colorScale);
    }

    var adjc = adjColor = color(c.levels[0], c.levels[1], c.levels[2], 120);
    stroke(adjc);
    line(i, y, i, y+h);
  }
  fill(76, 82, 83);
  noStroke();
  textAlign(RIGHT);
  text(minDateDiff + ' days ago', x - padding, y + h/2);
  textAlign(LEFT);
  text(maxDateDiff + ' days ago', x + w + padding, y + h/2);
}
