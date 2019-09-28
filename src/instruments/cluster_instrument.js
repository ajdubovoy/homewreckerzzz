import wave from '../helpers/wave.js';
import midiToFreq from '../helpers/midi_to_freq';

export default class {
  constructor(context) {
    this.context = context;
    this.active = [];
    this.destination = null;
  }

  play(options = {}) {
    const compressor = this.context.createDynamicsCompressor();
    const gain = this.context.createGain();
    this.destination = gain;
    compressor.connect(gain);
    gain.connect(this.context.destination);
    const desiredAmplitude = options.amplitude / 128 || 0.000001; // Convert from MIDI standard and prevent 0 value error
    gain.gain.value = desiredAmplitude;
    const chord = this[options.clusterType](parseInt(options.frequency, 10));
    this.playChord(chord, options);
  }

  update = (options = {}) => {
    const chord = this[options.clusterType](parseInt(options.frequency, 10));
    const amplitude = options.amplitude / 128 || 0.000001; // Convert from MIDI standard and prevent 0 value error
    const frequency = midiToFreq(options.frequency);

    chord.forEach((m, index) => {
      const sound  = this.active[index];
      if (sound) {
        let curr = sound.destination.gain.value;
        sound.destination.gain.exponentialRampToValueAtTime(curr, sound.context.currentTime);
        sound.destination.gain.exponentialRampToValueAtTime(amplitude, sound.context.currentTime + 0.1);
        sound.osc.frequency.exponentialRampToValueAtTime(midiToFreq(m), sound.context.currentTime + 0.2);
      } else {
        this.active.push(wave(midiToFreq(m), options.sustain ? 0 : 0.2, this.context, options.waveType, this.destination));
      }
    });
  }

  playChord = (chord, options = {}) => {
    chord.forEach((m) => this.active.push(wave(midiToFreq(m), options.sustain ? 0 : 0.2, this.context, options.waveType, this.destination)));
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
