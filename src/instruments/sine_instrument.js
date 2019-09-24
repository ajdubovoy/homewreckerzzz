import {sineDoop, sineSustain} from '../helpers/sine.js';

export default class {
  constructor(context) {
    this.context = context;
    this.sustain = false;
    this.active = [];
  }

  play = () => {
    this.majorChord(60);
  }

  majorChord = (root) => {
    // check out that fancy one-liner
    if(this.sustain) {
      [root, root+4, root+7].forEach((m) => this.active.push(sineSustain(this.midiToFreq(m), 0.2, this.context)));
    } else {
      [root, root+4, root+7].forEach((m) => sineDoop(this.midiToFreq(m), 2, 0.2, this.context));
    }
  }

  minorChord = (root) => {
    if(this.sustain) {
      [root, root+3, root+7].forEach((m) => this.active.push(sineSustain(this.midiToFreq(m), 0.2, this.context)));
    } else {
      [root, root+3, root+7].forEach((m) => sineDoop(this.midiToFreq(m), 2, 0.2, this.context));
    }
  }

  midiToFreq(midinote) {
    var exp = (midinote-69)/12;
    return Math.pow(2, exp)*440;
  }

  kill = () => {
    var self = this;
    this.active.forEach(function(sound) {
      var end = sound.env.stop(self.context.currentTime)
      sound.osc.stop(end);
    });
    this.active = [];
  }
}
