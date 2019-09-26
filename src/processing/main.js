import p5 from 'p5';
import {ShimmerSquare} from '../processing/Particle.js';

var sketch = new p5(p5 => {
  var particles = [];
  var f = 0;

  p5.setup = function() {
    var cnv = p5.createCanvas(510, 510); 
    cnv.parent('canvas-container');
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 360, 255, 255);
    p5.frameRate(30);
    console.log(window.innerWidth)
  };
  p5.draw = function() {
    p5.background(0);
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
        var randX = Math.random()*window.innerWidth;
        var randY = Math.random()*window.innerHeight;
        particles.push(new ShimmerSquare(
          p5.color(240, 200,255), 
          randX, 
          randY, 
          parseInt(60 + random*120), 
          p5
        ));
      }
    }
    f++;
  }
  p5.windowResized = function() {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  }
})