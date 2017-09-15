function setup() {
    
    createCanvas(800, 800);
    background('red');

}

function draw() {
    
    background('red');
    var s = second()*10;
    stroke(255,215,0);
    strokeWeight(4);
    noFill();
    arc(400,400,s,s,4.72984,HALF_PI/3);

    

    background(0, 0, 0, 0);
    var m = minute()*10;
    stroke(0,191,255);
    strokeWeight(4);
    // background('red');
    noFill();
    arc(400,400,m,m,HALF_PI/3,4*HALF_PI/3);
    
    
    
    background(0, 0, 0, 0);
    var h = hour()*24.5;
    stroke(127,255,212);
    strokeWeight(4);
    // background('red');
    noFill();
    arc(400,400,h,h,4*HALF_PI/3,4.72984);

    // fill('white');
    stroke(255,160,122);
    strokeWeight(1);
    ellipse(400,400,600,600);
    
    
    fill(255,160,122);
    strokeWeight(0);
    ellipse(400,400,4,4);
    
    // strokeWeight(1);
    // stroke('yellow');
    // line(400,400,400,100);
    // line(400,400,660,550);
    // line(400,400,400-260,550);
    
    
}