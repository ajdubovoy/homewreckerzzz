import wave from '../helpers/wave.js';
import midiToFreq from '../helpers/midi_to_freq';

export default class {
  constructor(context) {
    this.context = context;
    this.active = [];
  }

  play = (options = {}) => {
    const desiredAmplitude = options.amplitude / 128; // Convert from MIDI standard
    this.active.push(wave(midiToFreq(options.frequency), options.sustain ? 0 : 0.2, desiredAmplitude, this.context, options.waveType));
  }

  // majorChord = (root, options = {}) => {
  //   // check out that fancy one-liner
  //   [root, root+4, root+7].forEach((m) => this.active.push(wave(midiToFreq(m), options.sustain ? 0 : 2, 0.2, this.context)));
  // }

  // minorChord = (root, options = {}) => {
  //   [root, root+3, root+7].forEach((m) => this.active.push(wave(midiToFreq(m), options.sustain ? null : 2, 0.2, this.context)));
  // }

  kill = () => {
    var self = this;
    this.active.forEach(function(sound) {
      var end = sound.env.stop(self.context.currentTime)
      sound.osc.stop(end);
    });
    this.active = [];
  }
}
