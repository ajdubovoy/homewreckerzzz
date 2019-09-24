import {sineDoop, sineSustain} from '../helpers/sine.js';
import midiToFreq from '../helpers/midi_to_freq';

export default class {
  constructor(context) {
    this.context = context;
    this.active = [];
  }

  play = (options = {}) => {
    this.majorChord(60, options);
  }

  majorChord = (root, options = {}) => {
    // check out that fancy one-liner
    if(options.sustain) {
      [root, root+4, root+7].forEach((m) => this.active.push(sineSustain(midiToFreq(m), 0.2, this.context)));
    } else {
      [root, root+4, root+7].forEach((m) => sineDoop(midiToFreq(m), 2, 0.2, this.context));
    }
  }

  minorChord = (root, options = {}) => {
    if(options.sustain) {
      [root, root+3, root+7].forEach((m) => this.active.push(sineSustain(midiToFreq(m), 0.2, this.context)));
    } else {
      [root, root+3, root+7].forEach((m) => sineDoop(midiToFreq(m), 2, 0.2, this.context));
    }
  }

  kill = (options = {}) => {
    var self = this;
    this.active.forEach(function(sound) {
      var end = sound.env.stop(self.context.currentTime)
      sound.osc.stop(end);
    });
    this.active = [];
  }
}
