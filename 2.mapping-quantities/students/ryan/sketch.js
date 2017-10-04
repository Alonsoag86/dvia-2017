// define a global variable to hold our USGS data
var table;
var hght = 600;
var wdth = 1200;
var ymargin = hght/15;
var xmargin = wdth/20;
var zeroy = hght/10;
var zerox = wdth/10;

function preload() {
  // load data from either a local copy of one of the USGS CSVs or directly:
  table = loadTable("assets/significant_month.csv", "csv", "header");
  // or (while you're designing) from the feed itself:
  // table = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv", "csv", "header");
}
var ell;
function setup() {
  createCanvas(wdth,hght);
}

function draw() {
  background(240);
  strokeWeight(6);
  //rect(xmargin,ymargin,wdth-(2*xmargin),hght-(2*ymargin));
  line(xmargin+zerox,ymargin+zeroy,wdth-xmargin-zerox,ymargin+zeroy);

  strokeWeight(3);
  //width
  rowcount = table.getRowCount();
  xdiff = (wdth-(2*xmargin)-(2*zerox))/(rowcount-1)

  //get max and mix depths
  maxd = table.getNum(0,"depth");
  mind = table.getNum(0,"depth");

  function getmaxdepth() {
    if (table.getNum(r,"depth") > maxd) {
      maxd = table.getNum(r,"depth")
    }
    return maxd
  };
  function getmindepth() {
    if (table.getNum(r,"depth") < mind) {
      mind = table.getNum(r,"depth")
    }
    return mind
  };

  for (r=0;r<rowcount;r++) {
    getmindepth();
    getmaxdepth();
  }

  var maxy = hght - ymargin - (zeroy/2);
  var miny = ymargin + (zeroy/2);
  var ydiff = (maxy-miny)/(maxd-mind);
  var magscale = xdiff/12;


  sortedtime = sort(table.getColumn("time"));
  console.log(sortedtime);
  for (t=0;t<sortedtime.length;t++) {
    for (r=0;r<rowcount;r++) {
      if (sortedtime[t] === table.get(r,"time")) {
        var x = xmargin+zerox+(xdiff*(t));
        var y = ymargin+zeroy+(table.getNum(r,"depth")*ydiff);
        var diam = (table.getNum(r,"mag")+2)*magscale;
        var rad = diam/2;

        line(x,ymargin+zeroy,x,y);
        if (mouseX <= x+rad && mouseX >= x-rad && mouseY <= y+rad && mouseY >= y-rad) {
          ellipse(x+random(-table.getNum(r,"mag"),table.getNum(r,"mag")),y+random(-table.getNum(r,"mag"),table.getNum(r,"mag")),diam);
          strokeWeight(0);
          textStyle(BOLD);
          text(table.getString(r,"time"),wdth/2,ymargin/3);
          text(table.getString(r,"place"),wdth/2,2*ymargin/3);
          text("Depth: "+table.getString(r,"depth") + "km, Mag:"+table.getString(r,"mag")+table.getString(r,"magType"),wdth/2,ymargin);
        } else {
          ellipse(x,y,diam);
        };
        strokeWeight(3);
      }
    }
  };

  //axes
  textAlign(LEFT);
  textStyle(NORMAL);
  text("Chronological →",xmargin+zerox,ymargin);
  translate(xmargin+(zerox/2),ymargin+zeroy);
  rotate(3*PI/2);
  textAlign(CENTER);
  text("0",0,0);
  text("← Depth (km)",-150,0);
  text(maxd,-(maxd*ydiff),0);
  rotate(-3*PI/2);
  translate(-(xmargin+(zerox/2)),-(ymargin+zeroy));

  textAlign(CENTER);
  text("Magnitude",wdth-1.5*xdiff,hght-ymargin-zeroy);

  if (mouseX <= wdth-2*xdiff+(xdiff/2) && mouseX >= wdth-2*xdiff-(xdiff/2) && mouseY <= hght-(xdiff/2)-5+(xdiff/24) && mouseY >= hght-(xdiff/2)-5-(xdiff/24)) {
    ellipse(wdth-2*xdiff+random(-1,1),hght-(xdiff/2)-5+random(-1,1),xdiff/12);
  } else {
    ellipse(wdth-2*xdiff,hght-(xdiff/2)-5,xdiff/12);
  };

  text("-1",wdth-2*xdiff,hght-(xdiff/2)+15 );
  if (mouseX <= wdth-xdiff+(xdiff/2) && mouseX >= wdth-xdiff-(xdiff/2) && mouseY <= hght-5 && mouseY >= hght-5-xdiff) {
    ellipse(wdth-xdiff+random(-12,12),hght-(xdiff/2)-5+random(-12,12),xdiff);
  } else {
    ellipse(wdth-xdiff,hght-(xdiff/2)-5,xdiff);
  }
  text("10",wdth-xdiff,hght-(xdiff/2)-5)

};
