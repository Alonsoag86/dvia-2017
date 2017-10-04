Table EQtable;
int w;
int h;

void preload() {
    //connect earthquake data
  EQtable = loadTable("significant_month.csv", "header");
  
}

void setup() { 
  size(displayWidth, displayHeight);
  w = displayWidth;
  h = displayHeight;
  background(255); 
  fill(255, 0, 0, 30);
  
  //test earthquake data connection
  println(EQtable.getRowCount() + " total rows in table");
 
  }
 

void draw() { 
  
  //number of earthquakes
  int size = EQtable.getRowCount();
  //set up array to store mag values
  float[] magArray = new float[size]; 
  //var to cycle through mag values
  int i = 0;

  //cycle through table:mag column
  for (TableRow row : EQtable.rows()) {
    float mag = row.getFloat("mag");
    println(mag);
    magArray[i] = mag;
    i++;
  }
  
  drawHistogram();
}

void drawHistogram(){
    float [] magnitudes = EQtable.getColumn("mag");
}