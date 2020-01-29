<template lang="pug">
#root
  #canvas-container
  canvas#chart-container
</template>

<script>
import p5 from 'p5';
import {colors} from '../data/instruments.js';
import MainSketch from "../processing/main.js";
import axiosClient from '../helpers/axios_client';
import remove from "lodash.remove";
import quiz from "../data/quizzes.js";
import { bar, line, pie, bubble } from "../processing/charts.js";

export default {
  data() {
    return {
      sketch: null,
      chart: null,
      queue: [],
      users: [],
      played: [],
      updateDuration: 100
    }
  },
  mounted() {
    this.sketch = new p5(MainSketch(this));
    this.chart = document.getElementById('chart-container').getContext('2d');
    this.timer = setInterval(() => {
      this.getClients();
      this.getQuiz();
    }, this.updateDuration);
    clearInterval(this.timer); // TODO: this is just for troubleshooting!!! Needs to be active in live version
    //sample usage of charts. animated charts pass interval functions as section arg of an arr so that they can be cleared
    //let simpleChart = bar(this.chart, [0.8,0.2]);
    
  },
  methods: {
    getClients() {
      axiosClient.get('clients')
        .then((r) => {
          r.data.filter((c) => c.connected && c.sockets.length && !this.played.includes(c.sockets[c.sockets.length-1].token))
            .map(c => ({user: c.token, task: c.sockets[c.sockets.length-1]})).flat()
            .forEach((el) => {
              if(el.task.message === "play" && !this.users.includes(el.user)) {
                let obj = {
                  user: el.user,
                  color: colors[el.task.request.controls.waveType].hue,
                  sustain: el.task.request.controls.sustain,
                  token: el.task.token,
                  type: "colors"
                }
                this.users.push(el.user);                
                this.queue.push(obj);
              } else if(el.task.message === "kill" && this.users.includes(el.user)) {
                this.killClient(el.user);
              }
          });
        });
    },
    killClient(user) {
      var arr = this.users.filter((el) => el != user);
      this.users = arr;
    },
    getQuiz() {
      axiosClient.get('quiz-responses')
        .then((r) => {
          let quiz = r.data.quiz;
          let filtered = r.data.responses.filter((res) => !this.played.includes(res.token));
          if(quiz.visualization != "numbers") {
            filtered.forEach((res) => {
              let key = quiz.visualization == "emoji" ? "answers" : "colors";
              let obj = {
                color: quiz[key][res.value-1],
                sustain: false,
                token: res.token,
                type: quiz.visualization
              }              
              this.queue.push(obj);
            })
          } else {
            let sum = 0;
            filtered.forEach((res) => {
              sum += parseInt(quiz.answers[res.value-1]);
            })
            if(filtered.length) {
              let obj = {
                color: Math.ceil(sum/filtered.length+2),
                sustain: false,
                token: filtered[0].token,
                type: quiz.visualization
              }              
              this.queue.push(obj);
            }
          }
        })
    }
  }
}
</script> 

<style lang="scss">
#canvas-container {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  overflow: hidden;
}
#chart-container {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  overflow: hidden;
}
</style>