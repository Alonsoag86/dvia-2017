var i;
var j;
var mx;
var hy;
var cnv;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  var vw = windowWidth;
  var vh = windowHeight;
  cnv = createCanvas(vw, vh);
  centerCanvas();
  background(200, 220, 220);
  mx = windowWidth/3;
  hy = windowHeight/25;
  s = second();
  m = minute();
  h = hour();
  //console.log(s, m, h);
  frameRate(1);
  for (i = 1; i <= m; i+= 1){
    console.log("i" + i + "m" + m);
    if (i % 15 == 0){
      stroke(255);
      } else {
      stroke(120);
      }
      line (mx, 0, mx, windowHeight);
      mx = mx +  windowWidth/90;
      //console.log("minutes" + m);
    }
  for (j = 0; j <= h; j+= 1){
    if (j % 12 == 0){
          stroke(0);
      } else {
          stroke(255);
      }
      line (0, hy, windowWidth/2, hy);
      hy = hy + windowHeight/25;
    //console.log("hours" + m);
  }
}

function windowResized() {
  centerCanvas();
}

function draw() { 
    ellipse(windowWidth/3, windowHeight/2, 59-second(), second());
    //console.log('drew second');
  //line(20, 20, )

   if (second() == 59)  {
      console.log("s" + s);
      if (m % 15 == 0 ) {
        console.log("this is m" + m);
            stroke(255);
        } else {
            stroke(120);
        }
      line (mx, 0, mx, windowHeight);
      mx = mx + windowWidth/90;
      //line (0, 10, g, windowHeight);
      //mx = mx + 1 ;
      //console.log('drew minute');  
    } if (minute() == 59)  {
      //console.log(m);
      if (h % 12 == 0){
          stroke(0);
      } else {
          stroke(255);
      }
      line (0, hy, windowWidth/2, hy);
      hy = hy + windowHeight/25;
      //line (0, 10, g, windowHeight);
      //mx = mx + 1 ;
      //console.log('drew hour');  
  }  

}
