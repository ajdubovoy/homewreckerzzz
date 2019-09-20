import Vue from 'vue/dist/vue.js';
import {sineDoop, sineSustain} from './sine.js';

var AudioContext = window.AudioContext || window.webkitAudioContext;
// just a silly demo for showing off the instruments
const app = new Vue({
  el: '#app',
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
  		this.active.forEach((sound) => sound.stop(0));
  		this.active = [];
  	}
  },
  template: `
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
  `
});
