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
import Quiz from "../data/quizzes.js";
import { bar, line, pie, bubble } from "../processing/charts.js";

export default {
  data() {
    return {
      sketch: null,
      chart: {
        context: null,
        current: null
      },
      queue: [],
      users: [],
      played: [],
      playing: {},
      updateDuration: 100,
      charts: {
        bar,line,pie,bubble
      }
    }
  },
  mounted() {
    this.sketch = new p5(MainSketch(this));
    this.chart.context = document.getElementById('chart-container').getContext('2d');
    this.timer = setInterval(() => {
      this.getClients();
      this.getQuiz();
    }, this.updateDuration);
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
          if(!r.data.quizResponses) {
            return;
          }
          r.data.quizResponses.forEach((quiz) => {
            let q = Quiz.find(el => el.id == quiz.quizID);
            let continuous = q.quantity == "multiple";
            let count = this.playing[quiz.token] ? this.playing[quiz.token] : 0;
            if(continuous && quiz.running) {
              for(let i = count; i < quiz.responses.length; i++) {
                this.addToQueue(quiz.responses[i], q);
              }
              this.playing[quiz.token] = quiz.responses.length;
            } else if(!quiz.running && !this.playing[quiz.token]){
              this.addSingleToQueue(quiz.responses, q);
              this.playing[quiz.token] = true;
            }
          })
        })
    },
    addToQueue(r, q) {
      let key = q.visualization == "emoji" ? "answers" : "colors";
      let obj = {
        color: q[key][r-1],
        sustain: false,
        type: q.visualization
      }
      this.queue.push(obj);
    },
    addSingleToQueue(list, quiz) {
      /*let sum = 0;
      list.forEach((res) => {
        sum += parseInt(quiz.answers[res-1]);
      })
      if(list.length) {
        let obj = {
          color: Math.ceil(sum/list.length+2),
          sustain: false,
          type: quiz.visualization
        }
        this.queue.push(obj);
      }*/
      let yes = list.filter((i) => i == 1).length;
      let no = list.filter((i) => i == 2).length;
      if(quiz.visualization == "curve" && list.length) {
        let obj = {
          color: Math.floor((yes/list.length)*20),
          sustain: false,
          type: quiz.visualization
        }
        this.queue.push(obj);
      } else if(quiz.class == "chart") {
        let data = [no/list.length, yes/list.length];
        this.chart.current = this.charts[quiz.visualization](this.chart.context, data);
        setTimeout(() => {
          let chart = this.chart.current;
          chart[1].length ? chart[1].forEach((el) => clearInterval(el)) : clearInterval(chart[1]); 
          chart[0].destroy();
        }, 10000);
      }
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
