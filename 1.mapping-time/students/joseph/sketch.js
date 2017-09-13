

var maxSecondsRadius, secondTicks;
var maxMinutesRadius, minuteTicks;
var maxHoursRadius, hourTicks;


function setup() {
	console.log(hour())
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

	//fill circles with current time
	mapTicks();
	console.log(minuteTicks + " " + hourTicks);

	for(var i = maxSecondsRadius; i <= minuteTicks; i++){
		stroke(10*i, 90, 90);
		ellipse(cX, cY, i, i);
	}

	for(var i = 0; i <= secondTicks; i++){
		stroke(90, 10*i, 90);
		ellipse(cX, cY, i, i);
	}

	for(var i = maxMinutesRadius; i <= hourTicks; i++){
		stroke(90, 90, 10*i);
		ellipse(cX, cY, i, i);
	}


}

function draw() {
	//draw second ticks
	mapTicks();
    drawSecCircles(secondTicks, maxSecondsRadius);
    drawMinCircles(minuteTicks, maxMinutesRadius);
    drawHrCircles(hourTicks, maxHoursRadius);
   //  console.log(secondTicks);
  	// console.log(maxSecondsRadius);

	function drawSecCircles(r, maxRad){
		stroke(90, 2*r, 90);
		ellipse(cX, cY, r, r);
		console.log(r);
		if(r == 0){
			fill(51);
			ellipse(cX, cY, maxRad, maxRad)
			noFill();
		}
	}

	function drawMinCircles(r, maxRad){
		stroke(2*r, 90, 90);
		ellipse(cX, cY, r, r);
		if(minute() == 0){
			fill(51);
			ellipse(cX, cY, maxRad, maxRad)
			noFill();
		}
	}

	function drawHrCircles(r, maxRad){
		stroke(90, 90, 2*r);
		ellipse(cX, cY, r, r);
		if(hour() == 0){
			fill(51);
			ellipse(cX, cY, maxRad, maxRad)
			noFill();
		}
	}
}



function mapTicks(){
	secondTicks = map(second(), 0, 60, 0, maxSecondsRadius);
	minuteTicks = map(minute(), 0, 60, maxSecondsRadius, maxMinutesRadius);
	hourTicks = map(hour(), 0, 24, maxMinutesRadius, maxHoursRadius);

}


