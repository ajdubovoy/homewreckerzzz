import Vue from 'vue';
import loadClip from './playFile.js';

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source = loadClip('uploads/aDayorTwo.mp3', audioCtx);

const app = new Vue({
  el: '#app'
});
