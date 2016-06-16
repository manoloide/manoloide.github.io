var capture;
var canvas;
var tracker
var w = 640, h = 480;

var font;
function preload() {
  font = loadFont("Yesteryear-Regular.ttf");
}

function setup() {
  capture = createCapture(VIDEO);
  canvas = createCanvas(w, h);
  capture.size(w, h);
  capture.hide();

  var content = document.getElementById('content');
  canvas.parent(content);
  capture.parent(content);
  
  tracker = new clm.tracker();
  tracker.init(pModel);
  tracker.start(capture.elt);

  textFont(font);
}

var click = false;
var positions;
function draw() {
  if(!click) {
    image(capture, 0, 0, w, h);
    
    positions = tracker.getCurrentPosition();

    noFill();
    stroke(255);
    beginShape();
    for (var i=0; i<positions.length; i++) {
      vertex(positions[i][0], positions[i][1]);
    }
    endShape();
  }
}

function mouseClicked() {
  click = !click;
  if(click) {
    image(capture, 0, 0, w, h);
    filter('GRAY');

    /*
    noStroke();
    fill(255, 0, 0);
    beginShape();
    for (var i=0; i<positions.length; i++) {
      vertex(positions[i][0], positions[i][1]);
    }
    endShape(CLOSE);
    */

    var points = [];
    points.push(createVector(positions[0][0], positions[0][1]));
    points.push(createVector(positions[14][0], positions[14][1]));
    points.push(createVector(positions[11][0], positions[11][1]));
    points.push(createVector(positions[3][0], positions[3][1]));

    var center = createVector(points[0].x, points[0].y);
    center.add(points[1]);
    center.mult(0.5);

    
    var w = (p5.Vector.dist(points[0], points[1])+p5.Vector.dist(points[2], points[3]))/2;
    var h = (p5.Vector.dist(points[0], points[3])+p5.Vector.dist(points[1], points[2]))/2;
    h *= 2.5;

    var angle = (p5.Vector.angleBetween(points[0],points[1])+ p5.Vector.angleBetween(points[2],points[3]))/2;
    /*
    fill(255);
    beginShape();
    for(var i = 0; i < points.length; i++) {
      var p = points[i];
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
    */
    /*
    rectMode(CENTER);
    fill(0, 255, 0, 80);
    rect(center.x, center.y, w, h);

    fill(255);
    ellipse(center.x, center.y, 40, 40);
    */

    var txt = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae vehicula odio, eu euismod elit. Ut quis diam a eros porttitor pellentesque. Sed semper pharetra ornare.";

    noStroke();
    fill(255);
    rectMode(CENTER);
    textSize(w/8);
    textAlign(CENTER, CENTER);
    push();
    translate(center.x, center.y);
    //rotateZ(angle);
    text(txt, 0, 0, w, h);
    pop();

/*
    stroke(255, 0, 0);
    line(center.x+cos(angle)*10, center.y+sin(angle)*10, center.x-cos(angle)*10, center.y-sin(angle)*10);
*/


    /*

    textAlign(CENTER, CENTER);
    text()
    
    fill(0, 0, 255);
    for (var i=0; i<positions.length; i++) {
      text(i, positions[i][0], positions[i][1]);
    }
    */
  }
}