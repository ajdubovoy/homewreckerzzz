<template lang="pug">
#canvas-container
</template>

<script>
import p5 from 'p5';
import {colors} from '../data/instruments.js';
import {ShimmerSquare, PulseSquare} from '../processing/Particle.js';
import remove from "lodash.remove";
import quiz from "../data/quizzes.js";

export default {
  data() {
    return {
      sketch: null,
      queue: [
        {
          user: "hi",
          color: 200,
          sustain: true
        }
      ],
      users: ['hi']
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
              cloud(el.color);
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
    }
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