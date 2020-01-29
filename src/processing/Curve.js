export class Curve {
  constructor(x, y, frames, ctx) {
     this.x = x;
     this.y = y;
     this.x0 = x;
     this.y0 = y;
     this.ctx = ctx;
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
  }
  
  isDead() {
     return this.frames > this.total; 
  }
  
  display() {
    this.ctx.noFill();
    this.ctx.stroke(1,200,255);
    this.ctx.strokeWeight(30);
    this.ctx.beginShape();
    for(let i = 0; i < this.frames; i++) {
      this.ctx.vertex(this.curve[i][0], this.curve[i][1]);
    }
    this.ctx.endShape();
  }
  
  update() {
    let index = Math.min(this.frames, this.total-1);
    this.x = this.curve[index][0];
    this.y = this.curve[index][1];
    this.frames++;
  }
}

function genPoints(x,y,cx1,cy1,dist) {
  let cx2,cy2,x2,y2,rand;
  if(!cx1 && !cy1) {
    cx1 = x + randDist(500);
    cy1 = y + randDist(500);
  } else {
    cx1 = x - dist;
    cy1 = y - dist;
  }
  x2 = x+randDist(1000);
  y2 = y+randDist(1000);
  rand = randDist(1000);
  cx2 = x2 + rand;
  cy2 = y2 + rand;
  function randDist(r) {
    return Math.floor(Math.random()*r-(r/2.0));
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
function interpolate(a, b, frac) {
    var c = a+(b-a)*frac;
    return c;
}