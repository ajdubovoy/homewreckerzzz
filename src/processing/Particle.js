export class Particle {
  constructor(x, y, frames, ctx) {
     this.x = x;
     this.y = y;
     this.frames = frames;
     this.total = frames;
     this.ctx = ctx;
  }
  
  isDead() {
     return this.frames < 0; 
  }
  
  display() {
  }
  
  update() {
  }
}


export class Square extends Particle {
  constructor(c, x, y, frames, ctx) {
    super(x, y, frames, ctx);
    this.c = c;
  }
  
  display() {
    this.ctx.noStroke();
    this.ctx.fill(this.c);
    this.ctx.rectMode(this.ctx.CENTER);
    this.ctx.rect(this.x,this.y,50,50);
  }
  
  update() {
    var h = this.ctx.hue(this.c);
    var s = this.ctx.saturation(this.c);
    var b = this.ctx.brightness(this.c);
    this.c = this.ctx.color(h, s, 255 * (frames/float(total)));
    this.frames--;
  }
}




export class ShimmerSquare extends Square {
  constructor(c, x, y, frames, ctx) {
    super(c, x, y, frames, ctx);
    this.upperBound = this.ctx.hue(c) + 8;
    this.lowerBound = this.ctx.hue(c) - 8;
  }
  
  update() {
    var h = this.ctx.hue(this.c);
    var s = this.ctx.saturation(this.c);
    var b = this.ctx.brightness(this.c);
    h = h + parseInt(Math.random(-4,4));
    if(h > this.upperBound) {
      h = this.upperBound;
    }
    if(h < this.lowerBound) {
      h = this.lowerBound; 
    }
    this.c = this.ctx.color(h, s, 255 * (this.frames/this.total));
    this.frames--;
  }
}
