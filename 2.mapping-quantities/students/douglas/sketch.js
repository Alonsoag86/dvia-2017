//Doug's Earthquake 
//10-1-2017 7:33 PM

function preload() {
//  table = loadTable("assets/4.5_day.csv", "csv", "header");
  //var table;

   //etable = loadTable("assets/4.5_day.csv", "csv");

   etable = loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.csv", "csv");
}

function setup() {
  colorMode(HSB,360,100,100);
  createCanvas(1200, 600);
  background(0);
  textSize(10);
}

function draw() {
   var xPos = 250;
   var yPos = 450;
   //modify table
  //table.removeColumn("latitude");
  //table.removeColumn("longitude");
  etable.removeColumn(5);
  etable.removeColumn(5);
  etable.removeColumn(5);
  etable.removeColumn(5);
  etable.removeColumn(5);
  etable.removeColumn(6);
  etable.removeColumn(6);
  etable.removeColumn(8);
  etable.removeColumn(8);
  etable.removeColumn(8);
  etable.removeColumn(8);
  etable.removeColumn(8);
  etable.removeColumn(8);
  etable.removeColumn(8);
  etable.removeColumn(5);

  etable.addColumn("days_ago"); 
  etable.addColumn("date_earthquake"); 
  etable.addColumn("time_earthquake"); 
  etable.set (0,"date_earthquake", "when_date");
  etable.set (0,"time_earthquake", "when_time");
  etable.set (0,"days_ago", "days_ago");
  var ms_today = Date.now();

  for (var nr = 1; nr < etable.getRowCount(); nr++){
    var timeOfEarthquake = split (etable.getString (nr,0), "T");
    var ms_earthquake = Date.parse (etable.getString(nr,0));

    var ms_ago = ms_today - ms_earthquake;

    etable.set(nr, "days_ago", ms_ago);
    etable.set(nr, "date_earthquake", timeOfEarthquake[0]);
    etable.set(nr, "time_earthquake", timeOfEarthquake[1]);
  }
/*
  for (var nr = 1; nr < etable.getRowCount(); nr++){
    var timeOfEarthquake = split (etable.getString (nr,0), "T");
    //etable.set(nr, 7, timeOfEarthquake[0]);
    etable.set(nr, "tme", timeOfEarthquake[0]);
  }
*/

    //draw the map
    var xb1 = 150;
    var yb1 = 50;
    var xb2 = 1100;
    var yb2 = 400;
    fill(100,100,100);
    stroke (2,100,100);
    line(xb1,yb1,xb2,yb1);
    line(xb1,yb2,xb2,yb2);
    line(xb1,yb1,xb1,yb2);
    line(xb2,yb1,xb2,yb2);
    
    textSize(20);
    fill(360,0,60);    
    stroke(360,0,0);    
    text("Earthquakes with Magnitude 4.5+ as of " + month() + "-" + day() + "-" + year(), 420,30); 
    textSize(10);

    stroke (0,0,0);
  //println(table.getColumnCount());

  //stroke (60,100,100);
  //map(value,start1,stop1,start2,stop2,[withinBounds])

     
 
  var rc = etable.getRowCount();
  //Print the header
  textStyle(BOLD);
  for (var c = 0; c < etable.getColumnCount()-4; c++) {
    fill(360,0,60);    
    stroke(360,0,0);    
    text(etable.getString(0, c), xPos + c*110, yPos);
  }

             
          //draw NYC dot
          var yLatNY = 40.717951;
	  var xLongNY = -73.994875;           
           fill(80,100,100);
          var yLatNYCPlot = map(yLatNY*-1,-90,90,yb1,yb2);
          var xLongNYCPlot = map(xLongNY,-180,180,xb1,xb2);
	  stroke(80,100,100);
	  fill(360,0,0);
	  rect(xLongNYCPlot-8, yLatNYCPlot-8,8, 8);
	  //ellipse(xLongNYCPlot, yLatNYCPlot,10,10);
  	  textStyle(NORMAL);
	  stroke(360,0,0);
          fill(80,100,100);
	  text("New York", xLongNYCPlot -25, yLatNYCPlot -9);

  yPos = yPos+5;
  textStyle(NORMAL);


  //********BEGIN LOOP*********
  //cycle through the etable
  //  for (var r = 1; r < etable.getRowCount(); r++){
  var rowCounter=etable.getRowCount();
  var rowCounterMax=etable.getRowCount();
  var magSum = float(0);
  var depthSum = float(0);
  var maxRow = 20;
  if (etable.getRowCount() < 20) maxRow = etable.getRowCount();
  
  for (var r = 1; r < etable.getRowCount() ; r++){
       

      	  // 24*60*60*1000;
      clr = map(int (etable.getString (r,7)),0,24*60*60*1000,0,50);
      clrv = map(rowCounter,0,maxRow,10,90);
      fill(clr,80,clrv);

          //text(etable.getString(r,4), 10, 10);
         // text(etable.getString(r,1)*-1, 10, 20);
          rds = map (etable.getString(r,4), 4, 6.5,7,50);

          //lat -90 to +90
          //long -180 to 180

          // yLatNY = 40.717951;
	  // xLongNY = -73.994875;           

	  if (r==1){
	  var lat1 = float(yLatNY);
	  var lon1 = float(xLongNY);
	  
          //earthquake lat and long
	  var lat2 = float(etable.getString(r,1));
	  var lon2 = float(etable.getString(r,2));

          //Distance:	=ACOS( SIN(lat1)*SIN(lat2) + COS(lat1)*COS(lat2)*COS(lon2-lon1) ) * 6371000
          //var Distance = acos(sin(lat1)*sin(lat2) + cos(lat1)*cos(lat2)*cos(lon2-lon1) ) * 6371000;
          var Distance = acos(sin(lat1)*sin(lat2) + cos(lat1)*cos(lat2)*cos(lon2-lon1) ) * 6371;
	 
	 // fill(60,100,100);
        //  text("Distance: " + Distance, 50, 10);
       //   text("lat1: " + lat1, 50, 20);
        //  text("lon1: " + lon1, 50, 30);
         // text("lat2: " + lat2, 50, 40);
          //text("lon2: " + lon2, 50, 50);

          var yLat2 = map(etable.getString(r,1)*-1, -90, 90,yb1,yb2);
          var xLong2 = map(etable.getString(r,2), -180, 180,xb1,xb2);
	  stroke(360,0,30);
	  line(xLongNYCPlot, yLatNYCPlot, xLong2, yLat2);
	  stroke(360,0,0);

	  }

	  //plot the earthquakes
          var yLat = map(etable.getString(r,1)*-1, -90, 90,yb1,yb2);
          var xLong = map(etable.getString(r,2), -180, 180,xb1,xb2);
          ellipse(xLong,yLat,rds,rds);
	  fill(360,0,0);
          text(r, xLong-3,yLat+3);
          fill(clr,80,clrv);


      	  var num_ms_one_day = 24*60*60*1000;
      	  var num_ms_one_hour = 60*60*1000;
      	  var num_ms_one_minute = 60*1000;
      	  var num_ms_one_second = 1000;
    
      	  var ms_ago = int (etable.getString (r,7));
      	  var xMove=0;
      	  var xMove2=0;

          //print row counters 
          text(r, xPos - xMove2++*110 -20, yPos+r*15);

      if (ms_ago < num_ms_one_second ) {
         text(ms_ago + " ms ago", xPos + xMove++*110, yPos+r*15);
         } else if (ms_ago < num_ms_one_minute ) {
          var secs_ago = ms_ago / num_ms_one_second;
          text(secs_ago.toFixed (0) + " secs ago", xPos + xMove++*110, yPos+r*15);
         } else if (ms_ago < num_ms_one_hour ) {
         var mins_ago = ms_ago / num_ms_one_minute;
         text(mins_ago.toFixed (0) + " mins ago", xPos + xMove++*110, yPos+r*15);
         } else if (ms_ago < num_ms_one_day ) {
         var hours_ago = ms_ago / num_ms_one_hour;
         text(hours_ago.toFixed (0) + " hours ago", xPos + xMove++*110, yPos+r*15);
         } else {
         var days_ago = ms_ago / num_ms_one_day;
         text(days_ago.toFixed (0) + " days ago", xPos + xMove++*110, yPos+r*15);
         }

      text(etable.getString(r,1), xPos + xMove++*110, yPos+r*15);
      text(etable.getString(r,2), xPos + xMove++*110, yPos+r*15);
      text(etable.getString(r,3), xPos + xMove++*110, yPos+r*15);

      //draw bar for depth
      depth_length_bar = map (etable.getString(r,3), 0, 200,0,40);
      rect(xPos + (xMove-1)*110 +30, yPos+r*15 -9, depth_length_bar, 10);


      text(etable.getString(r,4), xPos + xMove++*110, yPos+r*15);

      //draw bar for length 
      mag_length_bar = map (etable.getString(r,4), 0, 6,0,40);
      rect(xPos + (xMove-1)*110 +18, yPos+r*15 -9, mag_length_bar, 10);

      magSum = magSum + float(etable.getString(r,4));
      depthSum = depthSum + float(etable.getString(r,3));
      //rect(x,y,w,h)
      //print place
      text(etable.getString(r,5), xPos + xMove++*110, yPos+r*15);

     // text(etable.getString(r,8), xPos + xMove++*110, yPos+r*15);
      var xMove=0;
      rowCounter--;
    }
     fill(204,50,76);
     var AvgMag = magSum/(rowCounterMax-1);
     text("Average Magnitude: " + nf(AvgMag,2,2), 30, 100);
     rds = map (AvgMag, 4, 6.5,7,50);
     ellipse(70,130,rds,rds);

     var AvgDepth = depthSum/(rowCounterMax-1);
     text("Average Depth: " + nf(AvgDepth,2,2), 35, 250);

}
