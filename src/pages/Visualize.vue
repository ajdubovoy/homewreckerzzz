<template lang="pug">
#canvas-container
</template>

<script>
import p5 from 'p5';
import {colors} from '../data/instruments.js';
import {ShimmerSquare, PulseSquare} from '../processing/Particle.js';
import {Digit} from '../processing/Text.js';
import remove from "lodash.remove";
import quiz from "../data/quizzes.js";

export default {
  data() {
    return {
      sketch: null,
      queue: [],
      users: []
    }
  },
  mounted() {
    this.sketch = new p5(main);
    var self = this;
    function main(_p5) {
      let p5 = _p5;
      var particles = [];
      var f = 0;
      var sustain = [];

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
          if(p.isDead()) {
            arr.splice(index, 1);
          }
        });
        sustain.forEach((p, index, arr) => {
          p.p.display();
          p.p.update();
          if(!self.users.includes(p.user)) {
            arr.splice(index, 1);
          }
        });
        if(self.queue.length != 0) {
          self.queue.forEach((el) => {
            if(self.users.includes(el.user) && el.sustain) {
              sustainCloud(el.color, el.user);
            } else {
              digitCloud(el.color);
            }
          })
          self.queue = [];
        }
        f++;
      }
      p5.windowResized = function() {
        p5.resizeCanvas(window.innerWidth, window.innerHeight);
      }

      function cloud(hue) {
        var centerX = Math.random()*window.innerWidth;
        var centerY = Math.random()*window.innerHeight;
        for(var i = 0; i < 10; i++) {
          let randX = centerX + (Math.random() * 200) - 100;
          let randY = centerY + (Math.random() * 200) - 100;
          particles.push(new ShimmerSquare(
            p5.color(hue, 200,255), 
            randX, 
            randY, 
            parseInt(30 + Math.random()*30), 
            p5
          ));
        }
      }
      function sustainCloud(hue, user) {
        var centerX = Math.random()*window.innerWidth;
        var centerY = Math.random()*window.innerHeight;
        for(var i = 0; i < 10; i++) {
          let randX = centerX + (Math.random() * 200) - 100;
          let randY = centerY + (Math.random() * 200) - 100;
          sustain.push({user: user, p: new PulseSquare(
            p5.color(hue, 200,255), 
            randX, 
            randY, 
            parseInt(30 + Math.random()*30), 
            p5
          )});
        }
      }
      function digitCloud(hue) {
        // makes perlin noise-based clouds of numbers
        var centerX = Math.random()*window.innerWidth;
        var centerY = Math.random()*window.innerHeight;
        var offset = Math.random()*500;
        for(var i = 0; i < 300; i++) {
          var noiseX = p5.noise(i*2 + offset, 0);
          var noiseY = p5.noise(0, i*2 + offset);
          centerX += ((noiseX - 0.5) * 400) + window.innerWidth;
          centerY += ((noiseY - 0.5) * 400) + window.innerHeight;
          centerX %= window.innerWidth;
          centerY %= window.innerHeight;
          var pNoise = p5.noise((centerX+offset)*0.25, (centerY+offset)*0.25); //multiplier affects density of the cloud. lower numbers are more dense
          particles.push(new Digit(
            p5.color(hue, 255,255), 
            centerX, 
            centerY, 
            parseInt(10 + pNoise*100), 
            Math.floor(pNoise*(offset*0.05)), //controls max brightness, now is random, but useful for later
            p5
          ));
        }
      }
    }
    setInterval(() => {
      this.queue.push({color: 120});
    }, 5000);
  },
  sockets: {
    clientWasPlayed(payload) {
      console.log(payload);
      let obj = {
        user: payload.token,
        color: colors[payload.options.controls.waveType].hue,
        sustain: payload.options.controls.sustain
      }
      this.users.push(payload.token);
      this.queue.push(obj);
    },
    clientWasKilled(payload) {
      var arr = remove(this.users, (el) => el === payload.token);
      this.users = arr;
    },
    quizTally(payload) {
      var self = this;
      let quiz = payload.quiz;
      let responses = payload.responses;
      responses.forEach((el) => {
        self.queue.push({user: "", color: payload.quiz.colors[el], sustain: false});
      })
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