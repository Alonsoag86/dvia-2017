

var maxSecondsRadius, secondTicks;
var maxMinutesRadius, minuteTicks;
var maxHoursRadius, hourTicks;

function setup() {
	createCanvas(800,600);
	background(51);
	ellipseMode(RADIUS);
	frameRate(60);

	maxSecondsRadius = width/9;
	maxMinutesRadius = width/4.5;
	maxHoursRadius = width/3;
	cX = width/2;
	cY = height/2;
	
	// console.log(secondTicks = map(second(), 0, 60, 0, maxSecondsRadius));

	
	//initial "hands"
	noFill();
	ellipse(cX,cY, maxHoursRadius, maxHoursRadius);
	ellipse(cX,cY, maxMinutesRadius, maxMinutesRadius);
	ellipse(cX,cY, maxSecondsRadius, maxSecondsRadius);

	//fill circles with time elapsed so far
	mapTicks();
	for(var i = maxSecondsRadius; i <= minuteTicks; i++){
		stroke(i, 90, 90);
		ellipse(cX, cY, i, i);
	}

	for(var i = 0; i <= secondTicks; i++){
		stroke(90, i, 90);
		ellipse(cX, cY, i, i);
	}

	for(var i = maxMinutesRadius; i <= hourTicks; i++){
		stroke(90, 90, i);
		ellipse(cX, cY, i, i);
	}


}

function draw() {
	//draw second ticks
	mapTicks();
    drawSecCircles(secondTicks);
    console.log(secondTicks);
}

function drawSecCircles(r){
	var h = random(0,255);
	from = color(218, 165, 32);
	to = color(72, 61, 139);
	interA = lerpColor(from, to, .33);
	interB = lerpColor(from, to, .66);
	stroke(h, 90, 90);
	ellipse(cX, cY, r, r);
	h = (h + 1) % 255;
	
}

function mapTicks(){
	secondTicks = map(second(), 0, 60, 0, maxSecondsRadius);
	minuteTicks = map(second(), 0, 60, maxSecondsRadius, maxMinutesRadius);
	hourTicks = map(second(), 0, 60, maxMinutesRadius, maxHoursRadius);

}

