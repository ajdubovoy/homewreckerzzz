import {Particle} from './Particle.js';

export class Digit extends Particle {
  constructor(c, x, y, frames, max, ctx) {
    super(x, y, frames, ctx);
    this.c = c;
    this.interval = Math.floor(frames/max);
    this.text = '' + Math.min(Math.floor(frames/this.interval), 9);
    this.update();
  }
  
  display() {
  	this.ctx.textFont('Monospace', 48);
    this.ctx.noStroke();
    this.ctx.fill(this.c);
    this.particle = this.ctx.text(this.text, this.x, this.y);
  }
  
  update() {
    var h = this.ctx.hue(this.c);
    var s = this.ctx.saturation(this.c);
    var b = this.ctx.brightness(this.c);
    let digit = Math.min(Math.floor(this.frames/this.interval),9);
    this.c = this.ctx.color(h, s, 255 * (digit/9));
    this.frames--;
 	this.text = '' + digit;
  }
}

export class Emoji extends Particle {
  constructor(x, y, frames, emoji, ctx) {
    super(x, y, frames, ctx);
    this.text = emoji;
    this.size = 1;
    this.update();
  }
  
  display() {
    this.ctx.textFont('Open Sans', this.size);
    this.ctx.noStroke();
    this.particle = this.ctx.text(this.text, this.x, this.y);
  }
  
  update() {
    if(this.frames/this.total > 0.9) {
      this.size = this.size + 6;
    }
    if(this.frames/this.total < 0.1){
      this.size = this.size - 6;
    }
    this.frames--;
  }
}