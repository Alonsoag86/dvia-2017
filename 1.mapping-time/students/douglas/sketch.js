
//Doug's Clock
//  9-13-2017  10:07 AM  Version 1.0

function setup() {
  // Sets the screen to be x pixels wide and y pixels high
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);

//  var radius = min(width, height) / 2;  
  var radius = 15;  
  secondsRadius = radius*1;
}
// Hue , Saturation, Brightnes, alpha
//colorMode(HSB);

function draw() {
  var h = hour(); 
  var m = minute(); 
  var s = second(); 

//position of sun 
//var j_mins = m+h*60;
var j_mins = m+h*60;
var j_mins_map = map (j_mins, 0, 1440, 0, TWO_PI) +HALF_PI; 
var j_x = 200 + cos (j_mins_map) * 180;
var j_y = 200 + sin (j_mins_map) * 180;

//position of class event 
//class start
var e_mins = 0+19*60;
var e_mins_map = map (e_mins, 0, 1440, 0, TWO_PI) +HALF_PI; 
var e_x = 200 + cos (e_mins_map) * 180;
var e_y = 200 + sin (e_mins_map) * 180;

//position of lunch event 
//lunch start
var l_mins = 0+13*60;
var l_mins_map = map (l_mins, 0, 1440, 0, TWO_PI) +HALF_PI; 
var l_x = 200 + cos (l_mins_map) * 180;
var l_y = 200 + sin (l_mins_map) * 180;

//travel 1
var t1_mins = 0+7*60;
var t1_mins_map = map (t1_mins, 0, 1440, 0, TWO_PI) +HALF_PI; 
var t1_x = 200 + cos (t1_mins_map) * 180;
var t1_y = 200 + sin (t1_mins_map) * 180;

//travel 1
var t2_mins = 45+21*60;
var t2_mins_map = map (t2_mins, 0, 1440, 0, TWO_PI) +HALF_PI; 
var t2_x = 200 + cos (t2_mins_map) * 180;
var t2_y = 200 + sin (t2_mins_map) * 180;




//position of dinner event 
//dinner start
var d_mins = 0+18*60;
var d_mins_map = map (d_mins, 0, 1440, 0, TWO_PI) +HALF_PI; 
var d_x = 200 + cos (d_mins_map) * 180;
var d_y = 200 + sin (d_mins_map) * 180;

//position of sleep event 
//sleep start
var s_mins = 0+23*60;
var s_mins_map = map (s_mins, 0, 1440, 0, TWO_PI) +HALF_PI; 
var s_x = 200 + cos (s_mins_map) * 180;
var s_y = 200 + sin (s_mins_map) * 180;


//position of work event 
//wrk start
var w_mins = 0+9*60;
var w_mins_map = map (w_mins, 0, 1440, 0, TWO_PI) +HALF_PI; 
var w_x = 200 + cos (w_mins_map) * 180;
var w_y = 200 + sin (w_mins_map) * 180;

//position of work event 
//wrk start
var w2_mins = 0+14*60;
var w2_mins_map = map (w2_mins, 0, 1440, 0, TWO_PI) +HALF_PI; 
var w2_x = 200 + cos (w2_mins_map) * 180;
var w2_y = 200 + sin (w2_mins_map) * 180;




//position of coffee period  
//coffee start
var cstart_mins = 0+7*60;
var cstart_mins_map = map (cstart_mins, 0, 1440, 0, TWO_PI) +HALF_PI; 
var cstart_x = 200 + cos (cstart_mins_map) * 180;
var cstart_y = 200 + sin (cstart_mins_map) * 180;

//coffee end 
var cend_mins = 0+11*60;
var cend_mins_map = map (cend_mins, 0, 1440, 0, TWO_PI) +HALF_PI; 
var cend_x = 200 + cos (cend_mins_map) * 180;
var cend_y = 200 + sin (cend_mins_map) * 180;



  // Set the background to black and turn off the fill color
  //background(0, 20,20);
  //noFill();

  // The two parameters of the point() method each specify 
  // coordinates.
  // The first parameter is the x-coordinate and the second is the Y 
  strokeWeight(1);
  stroke(0,0,0);
   //line(x1,y1,x2,y2)
  line(0, 200, 400, 200);
  line(200, 0, 200, 400);


// map(value,start1,stop1,start2,stop2)

  //var sec_size = map(s,0,60,20,100);
  var hour_sat = map(h,6,12,40,100);
  var sec_sat = map(s,0,60,4,100);
  var min_sat = map(m,0,60,100,0);
  var sec_size = map(s,0,60,0,25);

  //ellipse(x,y,w,[h])
//  ellipse(50,200,sec_size, sec_size);
  strokeWeight(1);
//  fill (60, 50,50,1);

  //sky above horizon
  //rect(x,y,w,h);
  fill (204, 100,50);
  rect(0,0,400,200);


fill(40,100,100);
//triangle(200,200,cstart_x,cstart_y,cend_x,cend_y);
stroke(0,0,0);

//triangle(200,200,cstart_x,cstart_y,cend_x,cend_y);


  //fill (60,0,0);
  //below horizon
  fill (0, 20,20);
  rect(0,200,400,200);

stroke(60,100,100);

var sun_col = color(60,100,100)
var event_col = color(60,100,100)

//interA = lerpColor(from, to, .33);
//interB = lerpColor(from, to, .66);
//fill(from);
//rect(10, 20, 20, 60);
//fill(interA);
//rect(30, 20, 20, 60);
//fill(interB);
//rect(50, 20, 20, 60);
//fill(to);
//rect(70, 20, 20, 60);


//sun
 sun_col = color(60,min_sat, min_sat )
  fill (sun_col);
  ellipse(j_x,j_y,30, 30);

//j  nofill(); 



//seconds in sun
  //fill (60,sec_sat,sec_sat);
//  ellipse(j_x,j_y,sec_size, sec_size);

  //line(j_x,j_y,j_x+100,j_y+100);

  //(HSB, 360, 100, 100, 1).
  //hue saturation brightness)

//ticker around sun
var sh = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
//line(j_x, j_y, j_x + cos(sh) * secondsRadius, j_y + sin(sh) * secondsRadius);
stroke(60,100,100);
line(j_x + cos(sh) * secondsRadius, j_y + sin(sh) * secondsRadius , j_x + cos(sh) * 20, j_y + sin(sh) * 20);


//event
  fill (30,90,40);
  stroke(30,90,40);
  ellipse(e_x,e_y,30, 30);
  fill(45,300,300);
  text('C', e_x-5,e_y+5);

//lunch
  fill (30,90,40);
  stroke(30,90,40);
  ellipse(l_x,l_y,30, 30);
  fill(45,300,300);
  text('L', l_x-5,l_y+5);

//travel1
  fill (30,90,40);
  stroke(30,90,40);
  ellipse(t1_x,t1_y,30, 30);
  fill(45,300,300);
  text('T', t1_x-5,t1_y+5);

//travel1
  fill (30,90,40);
  stroke(30,90,40);
  ellipse(t2_x,t2_y,30, 30);
  fill(45,300,300);
  text('T', t2_x-5,t2_y+5);


//dinner
  fill (30,90,40);
  stroke(30,90,40);
  ellipse(d_x,d_y,30, 30);
  fill(45,300,300);
  text('D', d_x-5,d_y+5);

//sleep
  fill (30,90,40);
  stroke(30,90,40);
  ellipse(s_x,s_y,30, 30);
  fill(45,300,300);
  text('S', s_x-5,s_y+5);


//work

//work
  fill (30,90,40);
  stroke(30,90,40);
  ellipse(w_x,w_y,30, 30);
  fill(45,300,300);
  text('W', w_x-5,w_y+5);

//work2
  fill (30,90,40);
  stroke(30,90,40);
  ellipse(w2_x,w2_y,30, 30);
  fill(45,300,300);
  text('W', w2_x-5,w2_y+5);



 // ellipse(200,200,400, 400);
 //debug 
//text (h, 10,10);
//text (m, 10,20);
//text (s, 10,30);
//text (m+h*60, 10,40);
//text (j_x, 10,50);
//text (j_y, 10,60);
//text (width, 300,10);
//text (height, 300,20);
//text (secondsRadius, 300,30);
//text (sh, 300,40);
//text ('Doug3', 300,50);

  //line(200,200, j_x+15, j_y+15);

}