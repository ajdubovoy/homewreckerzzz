<template>
  <div>
    <div>
      <label>Sustain: </label><input type="checkbox" v-model="sustain">
      <button v-on:click="killActive()">Kill</button>
    </div>
    <div>
      <button v-on:click="majorChord(60)">C MAJOR</button>
      <button v-on:click="majorChord(53)">F MAJOR</button>
      <button v-on:click="majorChord(55)">G MAJOR</button>
      <button v-on:click="minorChord(57)">A MINOR</button>
      <button v-on:click="minorChord(62)">D MINOR</button>
      <button v-on:click="minorChord(64)">E MINOR</button>
    </div>
  </div>
</template>

<script>
import {sineDoop, sineSustain} from '../helpers/sine.js';
var AudioContext = window.AudioContext || window.webkitAudioContext;

export default {
  name: 'Play',
  data: function() {
    return {
      context: new AudioContext(),
      sustain: false,
      active: []
    }
  },
  methods: {
    majorChord: function(root) {
      // check out that fancy one-liner
      if(this.sustain) {
        [root, root+4, root+7].forEach((m) => this.active.push(sineSustain(this.midiToFreq(m), 0.2, this.context)));
      } else {
        [root, root+4, root+7].forEach((m) => sineDoop(this.midiToFreq(m), 2, 0.2, this.context));
      }
    },
    minorChord: function(root) {
      if(this.sustain) {
        [root, root+3, root+7].forEach((m) => this.active.push(sineSustain(this.midiToFreq(m), 0.2, this.context)));
      } else {
        [root, root+3, root+7].forEach((m) => sineDoop(this.midiToFreq(m), 2, 0.2, this.context));
      }
    },
    midiToFreq: function(midinote) {
      var exp = (midinote-69)/12;
      return Math.pow(2, exp)*440;
    },
    killActive: function() {
      var self = this;
      this.active.forEach(function(sound) {
        var end = sound.env.stop(self.context.currentTime)
        sound.osc.stop(end);
      });
      this.active = [];
    }
  }
}
</script>

<style lang="scss">
</style>
