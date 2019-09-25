class Particle {
  constructor(x, y, frames) {
     this.x = x;
     this.y = y;
     this.frames = frames;
     this.total = frames;
  }
  
  isDead() {
     return this.frames < 0; 
  }
  
  display() {
  }
  
  update() {
  }
}


class Square extends Particle {
  constructor(c, x, y, frames) {
    super(x, y, frames);
    this.c = c;
  }
  
  display() {
    noStroke();
    fill(this.c);
    rectMode(CENTER);
    rect(this.x,this.y,50,50);
  }
  
  update() {
    var h = hue(this.c);
    var s = saturation(this.c);
    var b = brightness(this.c);
    this.c = color(h, s, 255 * (frames/float(total)));
    this.frames--;
  }
}




class ShimmerSquare extends Square {
  constructor(c, x, y, frames) {
    super(c, x, y, frames);
    this.upperBound = hue(c) + 8;
    this.lowerBound = hue(c) - 8;
  }
  
  update() {
    var h = hue(this.c);
    var s = saturation(this.c);
    var b = brightness(this.c);
    h = h + int(Math.random(-4,4));
    if(h > this.upperBound) {
      h = this.upperBound;
    }
    if(h < this.lowerBound) {
      h = this.lowerBound; 
    }
    this.c = color(h, s, 255 * (this.frames/this.total));
    this.frames--;
  }
}
