/*
we create our conception of time: 
natural time (external to us), vs mediated time

sounds: freesound.org
*/

/* FEATURES
Done: Stroke object
Done: Transforms / Rotate
Done: Perlin noise on pen strokes
Done: timer events 
Done: Slow reveal strokes
Done: Slow color strokes
Done: array add / remove 
Nope: zero point offset - taken care of w sDisp
Done: mouseSplosion
Done: stroke: off by 1

Done: stroke sizing
Done: ordered drawing outside to inside
Nope: Meandering pen movement -  used mouse XY
Done: Blot object
TODO: csv reader - decided what == distraction
Done: window resize update propagation
Done: test keys to show features  (a,s | b | 1,2,3,4)

Extra
TODO: sound
Nope: make sec dots at center instead - didn't look good
Nope: every x sec is bold? - no value
Done: make stroke more ornate
Nope: Stroke death: fade, wind? - NO. Too visually busy...?
DEAD: get tint() working / nope. broken but good.
*/

/* Visualizations
Stroke birth is black ink but lerps to a color relative to season & grows to size.
Stroke death is reverse of death but a bit faster
hrs,min,sec - circular form
between seasons - color lerp
digital activities - inkblots
digital activity % distraction = blot size & alpha
*/

var sArr=[];	// stroke array
var bArr=[];	// blot array
var blotTimeout = 0;

gX = 150;	// fb x size
gY = 150;	// fb y size
gPts = 30;	// points to modify by noise for each stroke
sDisp = 7;	// stroke disperson around ring
sDens = 10;	// stroke density

midX = 0;  	// canvas midx
midY = 0;	// canvas midy

tPrev = [];	// previous time
tMax = [];	// max for each time value

black = null;
fadeTime = 20.0;


// Distracted / tech mediated time drawing
function Blot (strength, x, y) {
    this.alive = true;
    this.color = color;
    this.strength = map(strength, 0, 100, 0, 300);
    this.sizeMax = map(strength, 0, 100, 10, 40); // size of blot
    this.size=5;
    this.g = createGraphics(gX, gY);
    this.midGX = gX/2;
    this.midGY = gY/2;
    this.x = mouseY;
    this.y = mouseX;
    
    this.genBlot = function () {
      //this.g.background(255);  // need transparent "color" so as not to have to constantly malloc framebuffer
      this.g = createGraphics(gX, gY);
      this.g.fill(20, constrain(this.strength, 0, 255));
      this.g.stroke(0, constrain(this.strength, 0, 255));
      this.g.ellipse(this.midGX, this.midGY, this.size, this.size);
    }
    
    // array filter test
    this.fTest  = function (val) {
      return (val != this);
    }
    
    this.update = function () {
    
      if (this.size < this.sizeMax) this.size+=20;
      
      this.strength-=4;
      this.genBlot();
      if (this.strength <= 0) {  // invisible == eol
        bArr = bArr.filter(this.fTest, this);
	return (false);
      }
      return(true);
    }
    
    this.draw = function () {
      push();
      translate(this.y - this.midGY, this.x - this.midGY);
      image(this.g, 0, 0);
      pop()
    }
}
    
// "Natural" time drawing  
function Stroke (color, type, val, month) {
    this.alive = true;
    //this.color = color;
    this.type = type;
    this.locX = midX;
    this.locY = midY;
    this.endX = 0;
    this.endY = 0;
    this.rotation = 0;
    this.g = createGraphics(gX, gY);
    this.sFrame = frameCount;	// start fc
    this.eFrame = -1;		// end fc
    
    this.genStroke = function (cPercent) {
      //this.g.tint(55, 4);  // not working

      var x=0;
      var y=0;
      // var c = lerpColor(black, this.color, cPercent);	// start off like black ink
      var c = lerpColor(black, currColor[type], cPercent);
      this.g.stroke(c);
      for (var idx = 0; idx < gPts; idx++) {
        var endX=x+(gX/gPts); 
        var endY=y+(gY/gPts);
        if (idx) {
          offset=idx*1.0/gPts;
          yoff = noise(offset+val) * 7;
          endY -= yoff; // TODO complicate w noise
        }
        var weight = gPts/2 - abs((gPts/2)-idx) ; // TODO easing on strokeweight
        this.g.strokeWeight(weight * 1.3);
        this.g.line(x, y, endX, endY);
        x=endX;
        y=endY;
      }
    }
    
    // array filter test
    this.fTest  = function (val) {
      return (val != this);
    }
    
    this.update = function () {
      
      if (this.alive) {  // grow in-out
        if (this.endX < gX) this.endX+=gX/4;
        if (this.endY < gY) this.endY+=gY/4;
      } else {
        if (this.endX >= 0) this.endX-=gX/4;
        if (this.endY >= 0) this.endY-=gY/4;
        if (this.endX <= 0 || this.endY <= 0) { // sanity check
          this.endX = 2;
          this.endY = 2;
        }
      }
    
      if (frameCount-this.sFrame <= fadeTime) {  // fade in
        this.genStroke((frameCount-this.sFrame) / fadeTime);
      }
      if (! this.alive && this.eFrame < 0) // set death timer
        this.eFrame = frameCount;
        
      if (this.eFrame > 0 && frameCount-this.eFrame <= (fadeTime/1.5)) { // fade out
        var ft = (frameCount-this.eFrame) / (fadeTime/1.5)
        this.genStroke(1-(ft * ft));	// ease out - heavy bottom
      }
        
      if (this.eFrame > 0 && frameCount-this.eFrame > fadeTime) { // remove from array
	sArr = sArr.filter(this.fTest, this);
	return (false);
      }
      return (true);
    }
    
    this.draw = function () {
      var angleStep = TWO_PI / tMax[this.type];
      
      push();
      translate(midX, midY);
      rotate(angleStep * val * sDisp);
      
      var mouseSplode = map(mouseX, 0, width, 1, 6);
      var drawStart = sDens*this.type*mouseSplode;
      var sizeDiff = 10;
      var sizeX = constrain(this.endX, 0, gX - (4*sizeDiff) + (type*sizeDiff)); 
      var sizeY = constrain(this.endY, 0, gY - (4*sizeDiff) + (type*sizeDiff));
      image(this.g, drawStart, drawStart, sizeX, sizeY);
      pop()
    }
}

Date.prototype.isLeapYear = function() {
    var year = this.getFullYear();
    if((year & 3) != 0) return false;
    return ((year % 100) != 0 || (year % 400) == 0);
};

// Get Day of Year
Date.prototype.getDOY = function() {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if(mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
};

prevColor = [];
nextColor = [];
currColor = []; // lerped of the two
doyOff = 0;  // day of year offset - for demo

// set lerping colors by day of year
function setSeason () {
  var sSp = 79;   // start days of year
  var sSu = 172;
  var sFa = 265;
  var sWi = 355; 
  
  var lSp = 93;   // length of period in days
  var lSu = 93;
  var lFa = 90;
  var lWi = 79; 
  
  d = new Date;
  doy = d.getDOY() + doyOff;
  
  prevColor = winterColor;
  nextColor = springColor;
  var day = 0;
  var dLen = lWi;
  
  if (doy > sSp){ // BUG: leap year
    prevColor = springColor;
    nextColor = summerColor;
    var day = doy - sSp;
    var dLen = lSp;
  }
  if (doy > sSu){
    prevColor = summerColor;
    nextColor = fallColor;
    var day = doy - sSu;
    var dLen = lSu;
  }
  if (doy > sFa){
    prevColor = fallColor;
    nextColor = winterColor;
    var day = doy - sFa;
    var dLen = lFa;
  }
  
  if (doy > sWi){
    prevColor = winterColor;
    nextColor = springColor;
    var day = doy - sWi;
    var dLen = lWi;
  }  
  
  var strength = map(day, 0, dLen, 0, 1);
  for (var idx=0; idx < prevColor.length; idx++)
    currColor[idx] = lerpColor(prevColor[idx], nextColor[idx], strength);
}

maxSounds = 5;
strokeSounds = [];
blotSounds = []

function preload() {
  soundFormats('mp3', 'ogg');
  
  for (var idx=0; idx < maxSounds; idx++) {
    strokeSounds[idx] = loadSound('https://wolfm2.github.io/dviaE1/s' + idx + '.mp3');
    blotSounds[idx] = loadSound('https://raw.githubusercontent.com/wolfm2/wolfm2.github.io/master/dviaE1/b' + idx + '.mp3'); // wasn't being updated
  }
}

currEvent = 0;
nextEventEpoch = 0;
nextEventTitle = ""
eDelta = Date.now() - Date.parse("Sep 7, 2017 10:07:41 PM");  // epoch delta for demo 
eventNum = 0; // number of current events
firstTime = true;
doEvents = true;

function nextEvent() {  // Coarse right now.  Just Proof of concept.

  var currEpoch = Date.now() - eDelta;
  
  for (; currEvent < events.length; currEvent++) {
    if ( Date.parse(events[currEvent][0]) > currEpoch ) {
      var div = document.getElementById('event');
      if (doEvents) 
        div.innerHTML = 'Next event: ' + nextEventTitle;
      else
        div.innerHTML = 'Events Off';
      if (firstTime) { // flush prev events
        eventNum = 0; 
        firstTime = false;
      }
      return;
    } else {
      nextEventEpoch = Date.parse(events[currEvent][0]);
      nextEventTitle = events[currEvent][1];
      if (doEvents) eventNum++; 
    }
  }
  

}

function setup() {
  /* seasonal colors:
    summer	= bright egg yolk
    fall	= maple leaf orange/red
    winter	= aquamarine
    spring	= lime green
  */
 
  nextEvent();
  
  //summerColor = [color('#ffd827'), color('#fe6b05'), color('#ec1b45'), color('#668013')];
  summerColor = [color('#f8ff00'), color('#fe6b05'), color('#c20065'), color('#067515')];
  fallColor = [color('#7e0304'), color('#d33f0f'), color('#fb8840'), color('#fcaf67')];
  winterColor = [color('#b5a5bf'), color('#d8cce0'), color('#757da4'), color('#13161f')];
  //springColor = [color('#dbec90'), color('#c5db5d'), color('#7b9677'), color('#11b99f')]; 
  springColor = [color('#f8e69a'), color('#fab5a6'), color('#96cf4c'), color('#009900')]; 

  setSeason();
  
  tMax = [59, 59, 23, 32 - new Date(year(), month(), 32).getDate(), 12];
  
  black = color(0, 100);
  
  update();
  createCanvas(windowWidth, windowHeight);
  
  //o.background(222);  // background assumed transparent
  
  t = [second(), minute(), hour(), day(), month()];
  tPrev = t; // previous time
  for (var tidx=0; tidx < t.length - 1; tidx++) {	// make all strokes
    for (var nidx=0; nidx < t[tidx] - 1; nidx++) {
      // var c = lerpColor(currColor[tidx], nextColor[tidx], .33);
      var o = new Stroke(-1, tidx, nidx, 0)
      sArr.push(o);		// add object to array
    }
  }
  
  
  
}


function update () {
  t = [second(), minute(), hour(), day(), month()]; 
  
  nextEvent();
  
  for (var idx=0; idx < t.length; idx++) {		// compare all except month
    
    if (t[idx] != tPrev[idx]) {		// if new...
      if (idx == 4) {					// if the month turns over get new end day
        tMax = [60,60,24, 32 - new Date(year(), month(), 32).getDate(), 12];
        continue;
      }
      if (t[idx] == 0) {					// prev cycle finished
        for (var sidx=0; sidx < sArr.length; sidx++) {		// run through
          if (sArr[sidx].type == idx) {				// if correct type
            sArr[sidx].alive = false;				// kill all strokes for type
          }
        }
      }
      // console.log("Added: " + t[idx]);
      if (blotTimeout && blotTimeout < millis()) { // save a few cycles
        blotTimeout = 0;
      }
      
      if (t[idx] != 0 && !blotTimeout) { // don't draw stroke for 0 
        var c = lerpColor(currColor[idx], nextColor[idx], .33);
        var o = new Stroke(c, idx, t[idx], 0)
        //o.setup();
        sArr.push(o);					// add object to array
        //mySound.setVolume(0.1);
        strokeSounds[Math.round(random(4))].play();
      }
      
      tPrev[idx] = t[idx];				// update previous time
    }
  }
  
  midX = width / 2;
  midY = height / 2;
}

seasonChanged = false; // if we manually change the season

function draw() {

  update();
  background(255);
  
  /*
  fill(255,0,0);
  ellipse(
    200+100*cos(map(millis()%5000,0,5000,0,TWO_PI)),
    200+100*sin(map(millis()%5000,0,5000,0,TWO_PI)),
    20,20
  );
  */
  // FIXME: Make one one array per unit time.  This is dumb.
  for (tidx=t.length-1; tidx >= 0; tidx--) {  // draw by precedent (type)
    for (var idx=0; idx < sArr.length; idx++) {
      if (sArr[idx].type==tidx && sArr[idx].update()) {
        if (seasonChanged) sArr[idx].genStroke(1);
        sArr[idx].draw();
      }
    }
  }
  
  for (; eventNum > 0; eventNum--)  // make blots
    mouseClicked();
  
  seasonChanged = false;
  
  for (var idx=0; idx < bArr.length; idx++) {
    if (bArr[idx].update())
      bArr[idx].draw();
  }
}

function keyTyped() {
  if (key === '1') {
    currColor = springColor;
    seasonChanged=true;
  } else if (key === '2') {
    currColor = summerColor;
    seasonChanged=true;
  } else if (key === '3') {
    currColor = fallColor;
    seasonChanged=true;
  } else if (key === '4') {
    currColor = winterColor;
    seasonChanged=true;
  } else if (key === 's') {  // demo season color lerping
    doyOff += 20;
    setSeason();
    seasonChanged=true;
    console.log("doyOff: " + doyOff);  // demo season color lerping
  } else if (key === 'a') { 
    doyOff -= 20;
    setSeason();
    seasonChanged=true;
    console.log("doyOff: " + doyOff);
  } else if (key === 'd') {   // turn events off for demo
    doEvents = ! doEvents;
  } else if (key === 'p') {   // parse csv
    /*
    Papa.parse("https://raw.githubusercontent.com/wolfm2/wolfm2.github.io/master/dviaE1/events.csv", {
    //https://raw.githubusercontent.com/samizdatco/dvia-2017/master/1.mapping-time/students/michael/events.csv", {
	//worker: true,
	download: true,
	header: true,
	step: function(results) {
	console.log("Row:", results.data);
      }
    });
    */  // GitHub blocks xmlhttpRequest. Server side err in preflight.  Solution: Munge CSV into array.
  }
  // uncomment to prevent any default behavior
  return false;
}

function mouseClicked() {  // make blot
  var o = new Blot(random(0,100), 0, 0)
  bArr.push(o);
  blotTimeout = millis() + 1000;
  blotSounds[Math.round(random(4))].play(); 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // TODO need to update strokes too
}
