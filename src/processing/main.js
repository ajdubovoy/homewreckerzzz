var particles = [];
var f = 0;

function setup() {
  createCanvas(600, 400);
  resizeCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 255, 255);
  frameRate(30);
}


function draw() {
  background(0);
  particles.forEach((p, index, arr) => {
    p.display();
    p.update();
    if (p.isDead()) {
      arr.splice(index, 1);
    }
  });
  var random = Math.random(1);
  if(random < 0.8 && f % 30 == 0) {
    for(var i = 0; i < 30; i++) {
      var randX = Math.random()*windowWidth;
      var randY = Math.random()*windowHeight;
      particles.push(new ShimmerSquare(color(240, 200,255), randX, randY, int(60 + random*120)));
    }
  }
  f++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
