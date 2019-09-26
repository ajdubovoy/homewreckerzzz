import wave from '../helpers/wave.js';
import midiToFreq from '../helpers/midi_to_freq';

export default class {
  constructor(context) {
    this.context = context;
    this.active = [];
  }

  play(options = {}) {
    const compressor = this.context.createDynamicsCompressor();
    compressor.connect(this.context.destination);

    const chord = this[options.clusterType](parseInt(options.frequency, 10));
    this.playChord(chord, compressor, options);
  }

  playChord = (chord, destination, options = {}) => {
    const desiredAmplitude = options.amplitude / 128; // Convert from MIDI standard
    chord.forEach((m) => this.active.push(wave(midiToFreq(m), options.sustain ? 0 : 0.2, desiredAmplitude, this.context, options.waveType, destination)));
  }

  major = (root) => {
    return [root, root+4, root+7];
  }

  minor = (root) => {
    return [root, root+3, root+7];
  }

  chromatic = (root) => {
    return [root, root+1, root+2, root+3, root+4, root+5];
  }

  random = (root) => {
    const randomScaleDegree = () => {
      return Math.round(Math.random() * 12) + root;
    }

    const chord = [root];

    [1, 2, 3, 4, 5, 6].forEach(() => {
      if (Math.random() >= 0.1) {
        chord.push(randomScaleDegree());
      }
    });

    return chord;
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
