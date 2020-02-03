export class Instrument {
  constructor(c, y, interval, ctx) {
    this.y = y;
    this.c = c;
    this.frames = 0;
    this.period = 90;
    this.interval = Math.floor(this.period/interval); // interval is number of blips on screen per cycle. cycle is 3 seconds so 90 frames at 30fps (the period)
    this.ctx = ctx;
    this.draw = true;
    this.step = (window.innerWidth-300)/(interval - 1); // how many pixels per interval
    this.x = 150;
    this.chance = 0.75; // percent chance that a 'note' will be drawn
    this.radius = 150;
    this.curr = this.circle;
    this.shapes = [this.circle, this.cross, this.curveUp, this.curveDown, this.emoji];
    this.probs = [70,20,10,5,0];
    this.emoji = ['😍','🤓','🤗','🤯'];
    this.currEmoji = 0;
    this.stopped = true;
  }
  
  start() {
    this.stopped = false;
  }
  stop() {
    this.stopped = true;
    this.frames = 0;
  }
  display() {
    if(this.draw) {
      this.curr();
    }
  }
  
  update() {
    this.frames++;
    if(this.frames > this.period) {
      this.frames = 0;
      this.x = 150;
      return;
    }
    if(this.frames % this.interval == 0) {
      this.draw = Math.random() <= this.chance;
      this.currEmoji = Math.floor(Math.random()*4);
      this.chooseShape();
      this.x += this.step;
      return;
    }
    if(this.frames % this.interval == this.interval-5 && this.draw) {
      this.draw = false;
    }
  }

  isDead() {
    return false;
  }

  setChance(chance) {
    this.chance = chance;
  }

  setInterval(interval) {
    let progress = Math.floor(this.frames / this.interval);
    this.draw = false;
    this.interval = Math.floor(this.period/interval);
    this.step = (window.innerWidth-300)/(interval - 1);
    this.x = this.step*progress+150;
  }

  setColor(c) {
    this.c = c;
  }

  setSize(s) {
    this.radius = s;
  }
  
  // DRAW functions
  circle() {
    this.ctx.noStroke();
    this.ctx.fill(this.c);
    this.ctx.circle(this.x, this.y, this.radius);
  }
  cross() {
    this.ctx.noFill();
    this.ctx.stroke(this.c);
    this.ctx.strokeWeight(5);
    let r = this.radius/2;
    this.ctx.line(this.x-r, this.y-r, this.x+r, this.y+r);
    this.ctx.line(this.x-r, this.y+r, this.x+r, this.y-r);
  }
  curveUp() {
    this.ctx.noFill();
    this.ctx.stroke(this.c);
    this.ctx.strokeWeight(10);
    this.ctx.curve(this.x-1000,this.y-200, this.x, this.y, this.x+(this.step/2), this.y-200, this.x-(this.step/2),this.y);
  }
  curveDown() {
    this.ctx.noFill();
    this.ctx.stroke(this.c);
    this.ctx.strokeWeight(10);
    this.ctx.curve(this.x-800,this.y-200, this.x, this.y-(this.step/8), this.x+(this.step/2), this.y+(this.step/8), this.x-(this.step/2),this.y);
  }
  emoji() {
    this.ctx.textFont('Open Sans', 120);
    this.ctx.noStroke();
    this.ctx.text(this.emoji[this.currEmoji], this.x, this.y);
  }
  chooseShape() {
    this.curr = chooseWeighted(this.shapes, this.probs);
  }
  moreCurves() {
    this.probs = [20,20,30,30,0];
  }
  moreEmoji() {
    this.probs = [5,15,15,20,60];
  }
}

function chooseWeighted(items, chances) {
  var sum = chances.reduce((acc, el) => acc + el, 0);
  var acc = 0;
  chances = chances.map(el => (acc = el + acc));
  var rand = Math.random() * sum;
  return items[chances.filter(el => el <= rand).length];
}