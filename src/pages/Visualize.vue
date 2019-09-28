<template lang="pug">
#canvas-container
</template>

<script>
import p5 from 'p5';
import {colors} from '../data/instruments.js';
import {ShimmerSquare} from '../processing/Particle.js';

export default {
  data() {
    return {
      sketch: null,
      queue: [240, 300, 0]
    }
  },
  mounted() {
    this.sketch = new p5(main);
    var self = this;
    function main(_p5) {
      let p5 = _p5;
      var particles = [];
      var f = 0;

      p5.setup = function() {
        var cnv = p5.createCanvas(510, 510); 
        cnv.parent('canvas-container');
        p5.resizeCanvas(window.innerWidth, window.innerHeight);
        p5.colorMode(p5.HSB, 360, 255, 255);
        p5.frameRate(30);
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
        /*if(random < 0.8 && f % 30 == 0) {
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
        }*/
        if(self.queue.length != 0) {
          console.log(self.queue);
          self.queue.forEach((hue) => {
            let random = Math.random();
            particles.push(new ShimmerSquare(
              p5.color(hue, 200,255), 
              1000*random, 
              800*random, 
              parseInt(60 + random*120), 
              p5
            ));
          })
          
          self.queue = [];
        }
        f++;
      }
      p5.windowResized = function() {
        p5.resizeCanvas(window.innerWidth, window.innerHeight);
      }
    }
  },
  sockets: {
    clientWasPlayed(payload) {
      console.log(colors[payload.options.controls.waveType]);
      this.queue.push(colors[payload.options.controls.waveType]);
    }
  }
}
</script> 

<style lang="scss">
#canvas-container {
  height: 100vh;
  width: 100%;
}

</style>