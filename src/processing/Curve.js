export class Curve {
  constructor(x, y, c, frames, ctx) {
     this.x = x;
     this.y = y;
     this.ctx = ctx;
     this.c = c;
     let len = Math.floor(frames/3);
     this.total = len*3;
     this.frames = 0;
     let arr = new Array();
     let curveData = new Array(3);
     let p = genPoints(x,y,null,null,0);
     curveData[0] = p.slice();
     arr = arr.concat(bezier(p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7],len));
     p = genPoints(p[6],p[7],p[4],p[5],p[8]);
     curveData[1] = p.slice();
     arr = arr.concat(bezier(p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7],len));
     p = genPoints(p[6],p[7],p[4],p[5],p[8]);
     curveData[2] = p.slice();
     arr = arr.concat(bezier(p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7],len));
     this.curve = arr;
     this.dying = false;
     this.dead = false;
  }
  
  isDead() {
     return this.dead;
  }
  
  display() {
    this.ctx.noFill();
    this.ctx.stroke(this.c);
    this.ctx.strokeWeight(30);
    this.ctx.beginShape();
    if(this.dying) {
      for(let i = this.frames; i < this.total; i++) {
        this.ctx.vertex(this.curve[i][0], this.curve[i][1]);
      }
    } else {
      for(let i = 0; i < this.frames; i++) {
        this.ctx.vertex(this.curve[i][0], this.curve[i][1]);
      }
    }
    this.ctx.endShape();
  }
  
  update() {
    if(this.dying) {
      this.frames += 5;
    } else {
      this.frames++;
    }
    if(this.frames > this.total-1){
      if(this.dying) {
        this.dead = true;
      } else {
        this.frames = 0;
        this.dying = true;
      }
    }
  }
}

export class CurveInstrument {
  constructor(c, interval, ctx) {
    this.curves = [];
    this.c = c;
    this.ctx = ctx;
    this.period = 90;
    this.initial = interval;
    this.interval = Math.ceil(this.period/interval);
    this.chance = 0.1;
    this.stopped = true;
    this.frames = 0;
  }

  start() {
    this.stopped = false;
  }
  stop() {
    this.stopped = true;
  }

  display() {
    this.curves.forEach((el, i, arr) => {
      el.update();
      el.display();
      if(el.isDead()) {
        arr[i] = null;
      }
    });
    this.curves = this.curves.filter((el) => el != null);
  }
  
  update() {
    this.frames++;
    if(this.frames % this.interval == 0) {
      if(Math.random() <= this.chance) {
        let newCurve = new Curve(Math.random()*1000+200,Math.random()*500+200,this.c,Math.floor(Math.random()*5)*30+30,this.ctx);
        this.curves.push(newCurve);
      }
      return;
    }
  }

  setChance(chance) {
    this.chance = chance;
  }

  setInterval(interval) {
    this.interval = Math.floor(this.period/interval);
  }

  setColor(c) {
    this.c = c;
  }
}

function genPoints(x,y,cx1,cy1,dist) {
  let cx2,cy2,x2,y2,rand;
  let clampY = clamp(window.innerHeight);
  let clampX = clamp(window.innerWidth);
  if(!cx1 && !cy1) {
    cx1 = x + randDist(500);
    cy1 = y + randDist(500);
  } else {
    cx1 = x - dist;
    cy1 = y - dist;
  }
  x2 = clampX(x+randDist(1000));
  y2 = clampY(y+randDist(1000));
  rand = randDist(1000);
  cx2 = x2 + rand;
  cy2 = y2 + rand;
  function randDist(r) {
    return Math.floor(Math.random()*r-(r/2.0));
  }
  function clamp(max) {
    return function(amt) {
      if(amt > max) {
        amt = max - Math.floor(Math.random()*200);
      } else if(amt < 0) {
        amt = Math.floor(Math.random()*200);
      }
      return amt;
    }
  }
  return [x,y,cx1,cy1,cx2,cy2,x2,y2,rand]
}
function bezier(x1,y1,cx1,cy1,cx2,cy2,x2,y2,steps) {
  let output = new Array(steps);
  for(let i = 0; i < steps; i++) {
    let t = i/steps;
    let x = cube(1-t)*x1 + 3*sq(1-t)*t*cx1 + 3*(1-t)*sq(t)*cx2 + cube(t)*x2;
    let y = cube(1-t)*y1 + 3*sq(1-t)*t*cy1 + 3*(1-t)*sq(t)*cy2 + cube(t)*y2;
    output[i] = [x,y];
  }
  return output;
}
function cube(x) {
  return x*x*x;
}
function sq(x) {
  return x*x;
}