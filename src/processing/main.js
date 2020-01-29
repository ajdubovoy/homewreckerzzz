import {colors} from '../data/instruments.js';
import {ShimmerSquare, PulseSquare} from '../processing/Particle.js';
import {Digit, Emoji} from '../processing/Text.js';
import {Curve} from "../processing/Curve.js";

export default function main(ctx) {
  let self = ctx;
  return function(_p5) {
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
          arr[index] = null;
        }
      });
      particles = particles.filter((el) => el != null);
      sustain.forEach((p, index, arr) => {
        p.p.display();
        p.p.update();
        if(!self.users.includes(p.user)) {
          arr[index] = null;
        }
      });
      sustain = sustain.filter((el) => el != null);
      if(self.queue.length != 0) {
        self.queue.forEach((el) => {
          if(self.users.includes(el.user) && el.sustain) {
            sustainCloud(el.color, el.user);  
          } else {
            switch(el.type) {
              case "colors": 
                cloud(el.color);
                break;
              case "numbers":
                digitCloud(el.color);
                break;
              case "emoji":
                emojiCloud(el.color);
                break;
              case "curve":
                particles.push(new Curve(Math.random()*1000+200,Math.random()*500+200,c,Math.floor(Math.random()*5)*30+30,p5));
                break;
              default:
                cloud(el.color);
                break;
            }
            self.killClient(el.user);
          }
          if(el.token) {
            self.played.push(el.token);
            let len = self.played.length;
            self.played = len > 500 ? self.played.slice(len-500,len-1) : self.played;
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
    function digitCloud(maxBrightness) {
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
        var pNoise = p5.noise((centerX+offset)*0.2, (centerY+offset)*0.2); //multiplier affects density of the cloud. lower numbers are more dense
        particles.push(new Digit(
          p5.color(0, 0,255), 
          centerX, 
          centerY, 
          parseInt(10 + pNoise*100), 
          maxBrightness, //controls max brightness, now is random, but useful for later
          p5
        ));
      }
    }
    function emojiCloud(emoji) {
      var centerX = Math.random()*window.innerWidth;
      var centerY = Math.random()*window.innerHeight;
      for(var i = 0; i < 10; i++) {
        let randX = centerX + (Math.random() * 200) - 100;
        let randY = centerY + (Math.random() * 200) - 100;
        particles.push(new Emoji(
          randX, 
          randY, 
          parseInt(30 + Math.random()*30), 
          emoji,
          p5
        ));
      }
    }
  }
}