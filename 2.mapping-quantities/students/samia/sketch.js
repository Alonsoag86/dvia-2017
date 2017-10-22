

// position for the plot
var plotX1, plotY1; // top left corner
var plotX2, plotY2; // bottom right corner

var longitude;
var latitude;


// minimum and maximum values for magnitude and depth
var longitudeMin, longitudeMax;
var latitudeMin, latitudeMax;

var longitudeInterval = 30.0;
var latitudeInterval = 30.0;

// table as the data set
var table;


function preload() {
  //my table is comma separated value "csv"
  //and has a header specifying the columns labels
  table = loadTable("significant_month.csv", "csv", "header");
  }


function setup() {
  // console.log(table);
  createCanvas(1200,600);
  background(0);

  // define top left and bottom right corner of our plot
  plotX1 = 60;
  plotX2 = width - 60;
  plotY1 = 60;
  plotY2 = height - 60;

  fill(255);
  noStroke();
  rectMode(CORNERS);
  rect(plotX1, plotY1, plotX2, plotY2);

  longitude = table.getColumn("longitude");
  latitude = table.getColumn("latitude");
  id = table.getColumn("id");
  type = table.getColumn("type");
  place = table.getColumn("place")

  longitudeMin = -180.0;
  longitudeMax = +180.0;
  latitudeMin = +90.0;
  latitudeMax = -90.0;


  fill(255);
  textSize(15);
  textAlign (CENTER)
  text("UNPREDICTABLE EARTHQUAKES",width/2, plotY1-25);
  text(id[0] + " " + place[0], width/2, plotY2+35);

  // drawlongitudeLabels();
  drawAxis1Labels();
  drawAxis2Labels();
  drawDataPoints();


  function drawAxis1Labels(){
    fill (255,255,255);
    stroke(0);
    line(plotX1, height/2, plotX2, height/2);
 }

 function drawAxis2Labels(){
   fill (255,255,255);
   stroke(0);
   line(width/2, plotY1, width/2, plotY2);
}

var numberoflathash = 18;
var numberoflonghash = 32;
stroke(0);
fill(0);
strokeWeight(1);

for (i=0;i<numberoflathash;i++) {
  line((width/2)-5, plotY1+((plotY2-plotY1)/numberoflathash)*i, (width/2)+5, plotY1 + ((plotY2-plotY1)/numberoflathash)*i);
};
for (i=0;i<numberoflonghash;i++) {
  line(plotX1+((plotX2-plotX1)/numberoflonghash)*i, (height/2)-5, plotX1+((plotX2-plotX1)/numberoflonghash)*i, (height/2)+5);


};

  function drawDataPoints(){

    var boxwidth = 20
    var boxheight = 10

    strokeWeight(0);
    for(var i=0; i<longitude.length; i++){
      var x = map(longitude[i],longitudeMin, longitudeMax, plotX1, plotX2);
      var y = map(latitude[i],latitudeMin, latitudeMax, plotY2, plotY1);

      if ( type[i] === "earthquake") {
          fill(255,0,0,50);
      } else {
          fill(0,255,0,50);
    	}

      rect(x-(boxwidth/2),y-(boxheight/2),x+(boxwidth/2), y+(boxheight/2));

    }
}
}
